import {MigrationInterface, QueryRunner} from "typeorm";

export class ModifiedPostJsonFields1652030093793 implements MigrationInterface {
    name = 'ModifiedPostJsonFields1652030093793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "media_urls"`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD "media_urls" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD "comments" json NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD "comments" json array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "media_urls"`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD "media_urls" json array NOT NULL DEFAULT '{}'`);
    }

}
