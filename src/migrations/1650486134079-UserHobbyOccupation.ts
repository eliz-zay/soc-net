import {MigrationInterface, QueryRunner} from "typeorm";

export class UserHobbyOccupation1650486134079 implements MigrationInterface {
    name = 'UserHobbyOccupation1650486134079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" ADD "occupation" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD "hobbies" character varying(50) array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "hobbies"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP COLUMN "occupation"`);
    }

}
