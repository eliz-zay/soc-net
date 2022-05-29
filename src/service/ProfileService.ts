import { inject, injectable } from "inversify";
import { getRepository, IsNull, Repository } from "typeorm";

import config from '../../config.json';

import { Post, PostGroup, User } from '../model';
import { ErrorMessages } from '../messages';
import { LoggerService } from '.';
import { ProfileDataSchema, ProfileSummariesDataSchema, transformToProfileDataSchema, transformToProfileSummarySchema } from "../schema";
import { JwtPayload } from "../core";

enum ESubType {
    Followee = 'followees',
    Follower = 'followers'
}

@injectable()
export class ProfileService {
    private userRepository: Repository<User>;
    private postRepository: Repository<Post>;
    private postGroupRepository: Repository<PostGroup>;

    constructor(@inject('LoggerService') private logger: LoggerService) {
        this.userRepository = getRepository(User);
        this.postRepository = getRepository(Post);
        this.postGroupRepository = getRepository(PostGroup);
    }

    async getProfile(id: number): Promise<ProfileDataSchema> {
        const [user, groups, posts] = await Promise.all([
            this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.country', 'country')
                .leftJoinAndSelect('user.region', 'region')
                .loadRelationCountAndMap('user.followeesCount', 'user.followees')
                .loadRelationCountAndMap('user.followersCount', 'user.followers')
                .where('user.id = :id', { id })
                .andWhere('user.deletedAt is null')
                .getOne(),
            this.postGroupRepository.find({ where: { userId: id, deletedAt: IsNull() } }),
            this.postRepository.createQueryBuilder('post')
                .where('post.userId = :id', { id })
                .andWhere('post.deletedAt is null')
                .skip(0)
                .take(config.postsPerProfile)
                .getMany()
        ]);

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        return transformToProfileDataSchema(user as User & { followeesCount: number; followersCount: number }, groups, posts);
    }

    async follow(jwtPayload: JwtPayload, id: number) {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.followees', 'followees')
            .where('user.id = :id', { id: jwtPayload.id })
            .andWhere('user.deletedAt is null')
            .andWhere('followees.deletedAt is null')
            .getOne();

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        if (user.id === id) {
            throw ErrorMessages.YouCantFollowYourself;
        }

        const followee = await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!followee) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const isFollowing = user.followees.some(({ id }) => id === followee.id);

        if (isFollowing) {
            user.followees = user.followees.filter(({ id }) => id !== followee.id);
        } else {
            user.followees.push(followee);
        }

        await this.userRepository.save(user);
    }

    async getFollowers(id: number): Promise<ProfileSummariesDataSchema> {
        return this.getFollowersOrFollowees(id, ESubType.Follower);
    }

    async getFollowees(id: number): Promise<ProfileSummariesDataSchema> {
        return this.getFollowersOrFollowees(id, ESubType.Followee);
    }

    private async getFollowersOrFollowees(id: number, tableName: ESubType): Promise<ProfileSummariesDataSchema> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect(`user.${tableName}`, tableName)
            .where('user.id = :id', { id })
            .andWhere('user.deletedAt is null')
            .andWhere(`${tableName}.deletedAt is null`)
            .getOne();

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist; 
        }

        return { profiles: user[tableName].map((user) => transformToProfileSummarySchema(user)) };
    }
}
