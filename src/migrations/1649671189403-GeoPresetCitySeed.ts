import { MigrationInterface, QueryRunner } from "typeorm";

import { Geo } from "../model";
import geoPresets from './seed-data/geo.json';

export class GeoPresetCitySeed1648212817931 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const chunkSize = 1000;

        for (let i = 0; i < geoPresets.cities.length; i += chunkSize) {
            const chunk = geoPresets.cities.slice(i, i + chunkSize);
            queryRunner.manager.insert(Geo, chunk as Geo[]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM c_geo WHERE range = 'City'");
    }
}
