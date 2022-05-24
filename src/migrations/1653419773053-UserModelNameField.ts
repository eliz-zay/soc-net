import {MigrationInterface, QueryRunner} from "typeorm";

export class UserModelNameField1653419773053 implements MigrationInterface {
    name = 'UserModelNameField1653419773053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ADD "name" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "name"`);
    }

}
