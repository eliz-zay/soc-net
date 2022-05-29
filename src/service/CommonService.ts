import { ErrorMessages } from '../messages';
import { inject, injectable } from "inversify";
import winston from "winston";
import { getRepository, Repository } from "typeorm";

import { Geo, EGeoRange } from '../model/';
import { GeoDataSchema, transformToGeoSchema } from '../schema/';
import { LoggerService } from '.';

@injectable()
export class CommonService {
    private geoRepository: Repository<Geo>;

    constructor(@inject('LoggerService') private logger: LoggerService) {
        this.geoRepository = getRepository(Geo);
    }

    public async getCountries(): Promise<GeoDataSchema> {
        const geoPresets = await this.geoRepository.find({ where: { range: EGeoRange.Country } });

        return {
            geoList: geoPresets.map((geoPreset) => transformToGeoSchema(geoPreset))
        }
    }

    public async getRegions(countryId: number): Promise<GeoDataSchema> {
        const parentPreset = await this.geoRepository.findOne({ where: { id: countryId, range: EGeoRange.Country } });

        if (!parentPreset) {
            throw ErrorMessages.CountryWithGivenIdDoesntExist;
        }

        const geoPresets = await this.geoRepository.find({ where: { parentId: countryId, range: EGeoRange.Region } });

        return {
            geoList: geoPresets.map((geoPreset) => transformToGeoSchema(geoPreset))
        }
    }

    public async getCities(regionId: number): Promise<GeoDataSchema> {
        const parentPreset = await this.geoRepository.findOne({ where: { id: regionId, range: EGeoRange.Region } });

        if (!parentPreset) {
            throw ErrorMessages.RegionWithGivenIdDoesntExist;
        }

        const geoPresets = await this.geoRepository.find({ where: { parentId: regionId, range: EGeoRange.City } });

        return {
            geoList: geoPresets.map((geoPreset) => transformToGeoSchema(geoPreset))
        }
    }
}
