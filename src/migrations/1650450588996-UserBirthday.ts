import {MigrationInterface, QueryRunner} from "typeorm";

export class UserBirthday1650450588996 implements MigrationInterface {
    name = 'UserBirthday1650450588996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" RENAME COLUMN "age" TO "birthday"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD "birthday" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD "birthday" integer`);
        await queryRunner.query(`ALTER TABLE "c_user" RENAME COLUMN "birthday" TO "age"`);
    }

}
