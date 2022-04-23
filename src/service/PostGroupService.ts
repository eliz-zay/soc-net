import { inject, injectable } from "inversify";
import { getRepository, IsNull, Repository } from "typeorm";

import { KDefaultPostGroupName, KMaxGroupsPerUser, PostGroup, User } from '../model';
import { AddGroupRequest, GroupSchema, transformToGroupsSchema, UpdateGroupRequest } from '../schema';
import { assert, JwtPayload } from '../core';
import { ErrorMessages } from '../messages';
import { LoggerService, StorageService } from '.';
import moment from "moment";

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

        const { name, firstGroupNewName, viewType } = payload;

        const groups = await this.postGroupRepository.find({ userId: jwtPayload.id });

        assert(groups.length !== 0, 'Groups can\'t be empty for any user');

        /**
         * Case when there was one default group
         * Checking name colissions, renaming first group and inserting second
         */
        if (groups.length === 1) {
            if (name === firstGroupNewName) {
                throw ErrorMessages.GroupNamesCantBeEqual;
            }

            const result = await Promise.all([
                firstGroupNewName !== KDefaultPostGroupName
                    ? this.postGroupRepository.update(groups[0].id, { name: firstGroupNewName })
                    : null,
                this.postGroupRepository.save({
                    name,
                    viewType,
                    userId: jwtPayload.id,
                    orderNumber: groups.length + 1
                })
            ]);

            return result[1].id;
        }

        /**
         * Case when where were multiple groups
         * Checking name collisions with previous groups, checking max groupd ans inserting
         */

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

    public async get(jwtPayload: JwtPayload): Promise<GroupSchema[]> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const groups = await this.postGroupRepository.find({
            where: { userId: jwtPayload.id, deletedAt: IsNull() },
            order: { orderNumber: 'ASC' }
        });

        return groups.map((group) => transformToGroupsSchema(group));
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
