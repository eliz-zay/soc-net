import {MigrationInterface, QueryRunner} from "typeorm";

export class UserDeletedFlag1636382360587 implements MigrationInterface {
    name = 'UserDeletedFlag1636382360587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "is_deleted"`);
    }

}
