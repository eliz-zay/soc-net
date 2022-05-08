import { inject, injectable } from "inversify";
import { getRepository, IsNull, Repository } from "typeorm";

import { Deal, MediaUrl, Post, PostGroup, User } from '../model';
import { AddPostRequest } from '../schema';
import { assert, EFileType, getFileType, JwtPayload } from '../core';
import { ErrorMessages } from '../messages';
import { LoggerService, StorageService } from '.';
import moment from "moment";

@injectable()
export class PostService {
    private userRepository: Repository<User>;
    private postGroupRepository: Repository<PostGroup>;
    private postRepository: Repository<Post>;
    private dealRepository: Repository<Deal>;

    constructor(
        @inject('LoggerService') private logger: LoggerService,
        @inject('StorageService') private storageService: StorageService
    ) {
        this.userRepository = getRepository(User);
        this.postGroupRepository = getRepository(PostGroup);
        this.postRepository = getRepository(Post);
        this.dealRepository = getRepository(Deal);
    }

    public async addPost(jwtPayload: JwtPayload, payload: AddPostRequest): Promise<number> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const { content, groupId, dealId } = payload;

        const [group, deal] = await Promise.all([
            this.postGroupRepository.findOne({ id: groupId, deletedAt: IsNull() }),
            dealId ? this.dealRepository.findOne({ id: dealId, deletedAt: IsNull() }) : null
        ]);

        if (!group) {
            throw ErrorMessages.PostGroupDoesntExist;
        }

        if (dealId && !deal) {
            throw ErrorMessages.DealDoesntExist;
        }

        const post: Post = new Post({
            content,
            postGroupId: groupId,
            userId: jwtPayload.id
        });

        if (dealId) {
            post.dealId = dealId;
        }

        const createdPost = await this.postRepository.save(post);

        // TODO: if deal id then do some actions(switch deal state, notify agent)

        return createdPost.id;
    }

    public async addMediaToPhoto(jwtPayload: JwtPayload, postId: number, files: Express.Multer.File[]): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const post = await this.postRepository.findOne(postId);

        if (!post) {
            throw ErrorMessages.PostDoesntExist;
        }

        if (post.mediaUrls.length) {
            throw ErrorMessages.YouAlreadyUploadedMediaToPost;
        }

        const mediaUrls: MediaUrl[] = await Promise.all(files.map(async (file) => ({
            url: await this.storageService.upload(file.originalname, file.mimetype, file.buffer),
            type: getFileType(file)
        })));

        await this.postRepository.update(postId, { mediaUrls });
    }
}
