import {MigrationInterface, QueryRunner} from "typeorm";

export class UserOtpCodesEdit1650398687624 implements MigrationInterface {
    name = 'UserOtpCodesEdit1650398687624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "otp_codes"`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD "otp_codes" json NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "otp_codes"`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD "otp_codes" json array NOT NULL DEFAULT '{}'`);
    }

}
