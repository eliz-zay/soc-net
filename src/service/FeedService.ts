import { inject, injectable } from "inversify";
import { getRepository, In, IsNull, Repository } from "typeorm";
import moment from "moment";

import { LoggerService, StorageService } from ".";
import { JwtPayload } from "../core";
import { ErrorMessages } from "../messages";
import { User } from '../model';
import {
    MyFeedRequest,
    PostAndAuthorSchema,
    transformToPostAndAuthorSchema
} from "../schema";
import config from '../../config.json';

@injectable()
export class FeedService {
    private userRepository: Repository<User>;

    constructor(
        @inject('LoggerService') private logger: LoggerService,
        @inject('StorageService') private storageService: StorageService
    ) {
        this.userRepository = getRepository(User);
    }

    public async getMyFeed(jwtPayload: JwtPayload, payload: MyFeedRequest): Promise<PostAndAuthorSchema[]> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const createdAtRestriction = moment().utc().subtract(config.myFeedHoursLimit, 'hour');

        const user = await this.userRepository.findOne({ where: { id: jwtPayload.id, deletedAt: IsNull() } });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const userAndFollowees = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.followees', 'followees')
            .leftJoinAndSelect('followees.posts', 'posts')
            .where('user.id = :id', { id: jwtPayload.id })
            .andWhere('user.deletedAt is null')
            .andWhere('followees.deletedAt is null')
            .andWhere('posts.deletedAt is null')
            .andWhere('posts.createdAt >= :createdAtRestriction', { createdAtRestriction })
            .orderBy('posts.createdAt', 'DESC')
            .getOne();

        if (!userAndFollowees) {
            return [];
        }

        const { followees } = userAndFollowees;

        if (payload.mediaType && payload.mediaType.length) {
            followees.forEach((followees) => {
                followees.posts = followees.posts.filter((post) =>
                    post.mediaUrls.some((mediaUrl) => payload.mediaType?.includes(mediaUrl.type)
                ));
            });
        }

        return followees
            .map((user) => user.posts.map((post) => transformToPostAndAuthorSchema(post, user)))
            .flat()
            .slice((payload.page - 1) * payload.count, payload.count);
    }
}
