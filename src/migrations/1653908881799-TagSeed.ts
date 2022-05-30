import { MigrationInterface, QueryRunner } from "typeorm";

import { Tag } from "../model";
import { tagSeeds } from "./seed-data/tags";

export class TagSeed1653908881799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.manager.insert(Tag, tagSeeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM c_tag");
    }

}
