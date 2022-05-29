import {MigrationInterface, QueryRunner} from "typeorm";

export class UserBusinessFieldsNullableAndTelegram1653667519324 implements MigrationInterface {
    name = 'UserBusinessFieldsNullableAndTelegram1653667519324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ADD "wants_to_use_business_profile" boolean`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD "telegram" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "visible_for_ad_proposal" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "visible_for_ad_proposal" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "visible_for_ad_proposal" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "visible_for_ad_proposal" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "telegram"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "wants_to_use_business_profile"`);
    }

}
