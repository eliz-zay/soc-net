import { inject, injectable } from "inversify";
import { getRepository, IsNull, Repository } from "typeorm";
import moment from "moment";

import { KMaxGroupsPerUser, PostGroup, User } from '../model';
import {
    AddGroupRequest,
    GroupSchema,
    GroupAndPostsDataSchema,
    transformToGroupsSchema,
    UpdateGroupRequest,
    transformToGroupAndPostsDataSchema
} from '../schema';
import { JwtPayload } from '../core';
import { ErrorMessages } from '../messages';
import { LoggerService, StorageService } from '.';

@injectable()
export class PostGroupService {
    private userRepository: Repository<User>;
    private postGroupRepository: Repository<PostGroup>;

    constructor(
        @inject('LoggerService') private logger: LoggerService,
        @inject('StorageService') private storageService: StorageService
    ) {
        this.userRepository = getRepository(User);
        this.postGroupRepository = getRepository(PostGroup);
    }

    public async addGroup(jwtPayload: JwtPayload, payload: AddGroupRequest): Promise<number> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const { name, viewType } = payload;

        const groups = await this.postGroupRepository.find({ userId: jwtPayload.id });

        if (groups.length === KMaxGroupsPerUser) {
            throw ErrorMessages.MaxGroupsCountReached;
        }

        if (groups.map((mGroup) => mGroup.name).includes(name)) {
            throw ErrorMessages.GroupNamesCantBeEqual;
        }

        const newGroup = await this.postGroupRepository.save({
            name,
            viewType,
            orderNumber: groups.length + 1,
            userId: jwtPayload.id
        });

        return newGroup.id;
    }

    public async addGroupPreviewPhoto(jwtPayload: JwtPayload, groupId: number, photo: Express.Multer.File): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        await this.validateUserGroup(jwtPayload.id, groupId);

        const previewUrl = await this.storageService.upload(photo.originalname, photo.mimetype, photo.buffer);

        await this.postGroupRepository.update(groupId, { previewUrl });
    }

    public async updateGroup(jwtPayload: JwtPayload, groupId: number, params: UpdateGroupRequest): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        await this.validateUserGroup(jwtPayload.id, groupId);

        await this.postGroupRepository.update(groupId, this.postGroupRepository.create(params));
    }

    public async deleteGroup(jwtPayload: JwtPayload, groupId: number): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        await this.validateUserGroup(jwtPayload.id, groupId);

        await this.postGroupRepository.update(groupId, { deletedAt: moment.utc() });
    }

    public async get(userId: number): Promise<GroupSchema[]> {
        const user = await this.userRepository.findOne({ id: userId, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const groups = await this.postGroupRepository.find({
            where: { userId, deletedAt: IsNull() },
            order: { orderNumber: 'ASC' }
        });

        return groups.map((group) => transformToGroupsSchema(group));
    }

    public async getGroupAndPosts(jwtPayload: JwtPayload, groupId: number): Promise<GroupAndPostsDataSchema> {
        // TODO: check access to private groups

        const postGroup = await this.postGroupRepository
            .createQueryBuilder('postGroup')
            .leftJoinAndSelect('postGroup.posts', 'post')
            .where('postGroup.id = :groupId', { groupId })
            .andWhere('postGroup.deletedAt is null')
            .andWhere('post.deletedAt is null')
            .getOne();

        if (!postGroup) {
            throw ErrorMessages.PostGroupDoesntExist;
        }

        return transformToGroupAndPostsDataSchema(postGroup);
    }

    private async validateUserGroup(userId: number, groupId: number): Promise<PostGroup> {
        const group = await this.postGroupRepository.findOne({ id: groupId, deletedAt: IsNull() });

        if (!group) {
            throw ErrorMessages.PostGroupDoesntExist;
        }

        if (group.userId !== userId) {
            throw ErrorMessages.UserDoesntOwnThisPostGroup;
        }

        return group;
    }
}
