import { inject, injectable } from "inversify";
import { getRepository, In, IsNull, Repository } from "typeorm";
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

    // TODO: add pagination (bug with skip/take and join)
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

        const postStatQuery = this.postRepository
            .createQueryBuilder('post')
            .select('post.id', 'post_id')
            .addSelect(`sum((tag.code in (${hobbieCodes.map((code) => `'${code}'`)}))::int)::int`, 'tag_score')
            .addSelect(`(extract(epoch from ('${moment().utc().format('YYYY/MM/DD HH:mm:ss')}' - post.createdAt)) / 60)::int`, 'minutes_score')
            .leftJoin('post.tags', 'tag')
            .where('post.deletedAt is null')
            .groupBy('post.id')
            .having(`sum((tag.code in (${hobbieCodes.map((code) => `'${code}'`)}))::int) > 0`);

        const postQuery = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.tags', 'tag')
            .innerJoinAndSelect('post.user', 'user')
            .innerJoin(`(${postStatQuery.getQuery()})`, 'post_stat', 'post_stat.post_id = post.id')
            .where('user.id != :id', { id: user.id })
            .andWhere('post.deletedAt is null');

        if (followeeIds.length) {
            postQuery.andWhere('user.id not in (:...followeeIds)', { followeeIds });
        }

        const posts = await postQuery
            .orderBy(`
                ${config.recommendationCoefficients.minutes} * post_stat.minutes_score
                + ${config.recommendationCoefficients.tags} * post_stat.tag_score
                + ${config.recommendationCoefficients.likes} * post.likesCount
            `, 'DESC')
            .getMany();

        return posts.map((post) => transformToPostAndAuthorSchema(post, post.user));
    }
}
