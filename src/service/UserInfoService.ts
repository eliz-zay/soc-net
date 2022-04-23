import { inject, injectable } from "inversify";
import { getRepository, In, IsNull, Repository } from "typeorm";

import { EGeoRange, EProfileFillingStage, Geo, KDefaultPostGroupName, PostGroup, User } from '../model';
import { PersonalInfoRequest, UserInfoPatchRequest, PreferencesRequest, UserInfoSchema, transformToUserInfoSchema } from '../schema';
import { JwtPayload } from '../core';
import { ErrorMessages } from '../messages';
import { LoggerService, StorageService } from '.';

@injectable()
export class UserInfoService {
    private userRepository: Repository<User>;
    private geoRepository: Repository<Geo>;
    private postGroupRepository: Repository<PostGroup>;

    constructor(
        @inject('LoggerService') private logger: LoggerService,
        @inject('StorageService') private storageService: StorageService
    ) {
        this.userRepository = getRepository(User);
        this.geoRepository = getRepository(Geo);
        this.postGroupRepository = getRepository(PostGroup);
    }

    public async addPersonalInfo(jwtPayload: JwtPayload, payload: PersonalInfoRequest): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        if (user.profileFillingStage !== EProfileFillingStage.PersonalInfo) {
            throw ErrorMessages.UserAlreadyFilledPersonalInfo;
        }

        const { gender, birthday, countryId, regionId, cityId } = payload;

        /**
         * Checking existence and relation of geo
         */

        const geoIds = cityId ? [countryId, regionId, cityId] : [countryId, regionId];

        const geoList = await this.geoRepository.find({ id: In(geoIds) });

        if (geoIds.length !== geoList.length) {
            throw ErrorMessages.GeoWithGivenIdDoesntExist;
        }

        const country = geoList.find((mGeo) => mGeo.id === countryId);
        const region = geoList.find((mGeo) => mGeo.id === regionId);
        const city = cityId ? geoList.find((mGeo) => mGeo.id === cityId) : null;

        if (country!.range !== EGeoRange.Country) {
            throw ErrorMessages.GeoHasWroingRange;
        }

        if (region!.range !== EGeoRange.Region) {
            throw ErrorMessages.GeoHasWroingRange;
        }

        if (city && city!.range !== EGeoRange.City) {
            throw ErrorMessages.GeoHasWroingRange;
        }

        if (region!.parentId !== countryId) {
            throw ErrorMessages.RegionFromWrongCountry;
        }

        if (city && city!.parentId !== regionId) {
            throw ErrorMessages.CityFromWrongRegion;
        }

        /**
         *
         */

        await this.userRepository.update(
            user.id,
            {
                gender,
                birthday,
                countryId,
                regionId,
                cityId,
                profileFillingStage: EProfileFillingStage.Preferences
            }
        );
    }

    async addProfilePhoto(jwtPayload: JwtPayload, photo: Express.Multer.File): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const photoUrl = await this.storageService.upload(photo.originalname, photo.mimetype, photo.buffer);

        await this.userRepository.update(jwtPayload.id, { photoUrl });
    }

    async addPreferences(jwtPayload: JwtPayload, payload: PreferencesRequest): Promise<void> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        if (user.profileFillingStage !== EProfileFillingStage.Preferences) {
            throw ErrorMessages.UserAlreadyFilledPreferences;
        }

        const { visibleForAdProposal, businessDescription, occupation, hobbies, profileViewType } = payload;

        await Promise.all([
            this.userRepository.update(
                user.id,
                {
                    visibleForAdProposal,
                    businessDescription,
                    occupation,
                    hobbies,
                    profileFillingStage: EProfileFillingStage.Filled
                }
            ),
            this.postGroupRepository.insert({
                name: KDefaultPostGroupName,
                orderNumber: 1,
                viewType: profileViewType,
                user: { id: jwtPayload.id }
            })
        ]);
    }

    async update(jwtPayload: JwtPayload, payload: UserInfoPatchRequest) {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const { visibleForAdProposal } = payload;

        await this.userRepository.update(
            user.id,
            {
                visibleForAdProposal
            }
        );
    }

    async get(jwtPayload: JwtPayload): Promise<UserInfoSchema> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({
            where: { id: jwtPayload.id, deletedAt: IsNull() },
            relations: ['country', 'region', 'city']
        });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        return transformToUserInfoSchema(user);
    }
}
