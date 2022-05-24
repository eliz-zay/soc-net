import {MigrationInterface, QueryRunner} from "typeorm";

export class PostLikesCount1653400881514 implements MigrationInterface {
    name = 'PostLikesCount1653400881514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" ADD "likes_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "likes_count"`);
    }

}
