import { inject, injectable } from "inversify";
import { getRepository, IsNull, Repository } from "typeorm";

import { KDefaultPostGroupName, KMaxGroupsPerUser, PostGroup, User } from '../model';
import { AddGroupRequest } from '../schema';
import { assert, JwtPayload } from '../core';
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

        const { name, firstGroupNewName, groupViewType } = payload;

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
                    viewType: groupViewType,
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
            viewType: groupViewType,
            orderNumber: groups.length + 1,
            userId: jwtPayload.id
        });

        return newGroup.id;
    }
}
