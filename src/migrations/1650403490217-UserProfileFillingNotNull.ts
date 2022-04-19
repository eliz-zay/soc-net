import {MigrationInterface, QueryRunner} from "typeorm";

export class UserProfileFillingNotNull1650403490217 implements MigrationInterface {
    name = 'UserProfileFillingNotNull1650403490217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "profile_filling_stage" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "profile_filling_stage" SET DEFAULT 'PersonalInfo'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "profile_filling_stage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "profile_filling_stage" DROP NOT NULL`);
    }

}
