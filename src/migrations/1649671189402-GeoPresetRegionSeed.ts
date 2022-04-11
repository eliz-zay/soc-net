import { MigrationInterface, QueryRunner } from "typeorm";

import { Geo } from "../model";
import geoPresets from './seed-data/geo.json';

export class GeoPresetRegionSeed1648212807644 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const chunkSize = 1000;

        for (let i = 0; i < geoPresets.regions.length; i += chunkSize) {
            const chunk = geoPresets.regions.slice(i, i + chunkSize);
            queryRunner.manager.insert(Geo, chunk as Geo[]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM c_geo WHERE range = 'Region'");
    }
}
