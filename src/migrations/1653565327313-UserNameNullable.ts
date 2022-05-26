import {MigrationInterface, QueryRunner} from "typeorm";

export class UserNameNullable1653565327313 implements MigrationInterface {
    name = 'UserNameNullable1653565327313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "name" SET NOT NULL`);
    }

}
