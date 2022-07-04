import { inject, injectable } from "inversify";
import { getRepository, IsNull, Repository, getConnection } from "typeorm";
import moment from "moment";

import { LoggerService, StorageService } from ".";
import { JwtPayload } from "../core";
import { ErrorMessages } from "../messages";
import { User, Post } from '../model';
import {
    MyFeedRequest,
    PaginationRequest,
    PostAndAuthorSchema,
    transformToPostAndAuthorSchema
} from "../schema";
import config from '../../config.json';

@injectable()
export class FeedService {
    private userRepository: Repository<User>;
    private postRepository: Repository<Post>;

    constructor(
        @inject('LoggerService') private logger: LoggerService,
        @inject('StorageService') private storageService: StorageService
    ) {
        this.userRepository = getRepository(User);
        this.postRepository = getRepository(Post);
    }

    public async getMyFeed(jwtPayload: JwtPayload, payload: MyFeedRequest): Promise<PostAndAuthorSchema[]> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ where: { id: jwtPayload.id, deletedAt: IsNull() } });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const createdAtRestriction = moment().utc().subtract(config.myFeedHoursLimit, 'hour');

        const userAndFollowees = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.followees', 'followee')
            .leftJoinAndSelect('followees.posts', 'post')
            .where('user.id = :id', { id: jwtPayload.id })
            .andWhere('user.deletedAt is null')
            .andWhere('followee.deletedAt is null')
            .andWhere('post.deletedAt is null')
            .andWhere('post.createdAt >= :createdAtRestriction', { createdAtRestriction })
            .orderBy('post.createdAt', 'DESC')
            .getOne();

        if (!userAndFollowees) {
            return [];
        }

        const { followees } = userAndFollowees;

        if (payload.mediaTypes && payload.mediaTypes.length) {
            followees.forEach((followees) => {
                followees.posts = followees.posts.filter((post) =>
                    post.mediaUrls.some((mediaUrl) => payload.mediaTypes?.includes(mediaUrl.type)
                ));
            });
        }

        return followees
            .map((user) => user.posts.map((post) => transformToPostAndAuthorSchema(post, user)))
            .flat()
            .slice((payload.page - 1) * payload.count, payload.count);
    }

    public async getRecommendations(jwtPayload: JwtPayload, payload: PaginationRequest): Promise<PostAndAuthorSchema[]> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.hobbies', 'hobbie')
            .leftJoinAndSelect('user.followees', 'followee')
            .where('user.id = :id', { id: jwtPayload.id })
            .andWhere('user.deletedAt is null')
            .getOne();

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const hobbieCodes = user.hobbies.map((tag) => tag.code);
        const followeeIds = user.followees.map((f) => f.id);

        const filterQuery = getConnection()
            .createQueryBuilder()
            .select('sub_query.post_id', 'id')
            .addSelect(`
                ${config.recommendationCoefficients.minutes} * sub_query.minutes_score
                + ${config.recommendationCoefficients.tags} * sub_query.tag_score
                + ${config.recommendationCoefficients.likes} * sub_query.likes_score
            `, 'score')
            .from((subQuery) => {
                subQuery
                    .select('post.id', 'post_id')
                    .addSelect(
                        `sum((tag.code in (${hobbieCodes.map((code) => `'${code}'`)}))::int)::int`,
                        'tag_score'
                    )
                    .addSelect(
                        `(extract(epoch from ('${moment().utc().format('YYYY/MM/DD HH:mm:ss')}' - post.createdAt)) / 60)::int`,
                        'minutes_score'
                    )
                    .addSelect('post.likesCount', 'likes_score')
                    .from(Post, 'post')
                    .leftJoin('post.tags', 'tag')
                    .where('post.deletedAt is null')
                    .andWhere(`post.userId != ${user.id}`)
                    .groupBy('post.id')
                    .having(`sum((tag.code in (${hobbieCodes.map((code) => `'${code}'`)}))::int) > 0`);

                if (followeeIds.length) {
                    subQuery.andWhere(`post.user_id not in (${followeeIds})`);
                }

                return subQuery;
            }, 'sub_query')
            .orderBy('score', 'DESC')
            .skip(payload.count * (payload.page - 1))
            .take(payload.count)
            .getQuery();

        const posts = await this.postRepository
            .createQueryBuilder('post')
            .innerJoin(`(${filterQuery})`, 'filtered_post', 'filtered_post.id = post.id')
            .innerJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.tags', 'tag')
            .orderBy('filtered_post.score', 'DESC')
            .getMany();

        return posts.map((post) => transformToPostAndAuthorSchema(post, post.user));
    }
}
