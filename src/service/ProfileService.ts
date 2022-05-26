import { inject, injectable } from "inversify";
import { getRepository, Repository } from "typeorm";

import config from '../../config.json';

import { Post, PostGroup, User } from '../model';
import { ErrorMessages } from '../messages';
import { LoggerService } from '.';
import { ProfileDataSchema, transformToProfileDataSchema } from "../schema";

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
                .loadRelationCountAndMap('user.followeesCount', 'user.followees')
                .loadRelationCountAndMap('user.followersCount', 'user.followers')
                .where('user.id = :id', { id })
                .getOne(),
            this.postGroupRepository.find({ userId: id }),
            this.postRepository.createQueryBuilder('post')
                .loadRelationCountAndMap('post.likesCount', 'post.likes')
                .where('post.userId = :id', { id })
                .skip(0)
                .take(config.postsPerProfile)
                .getMany()
        ]);

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        return transformToProfileDataSchema(user as User & { followeesCount: number; followersCount: number }, groups, posts);
    }
}
