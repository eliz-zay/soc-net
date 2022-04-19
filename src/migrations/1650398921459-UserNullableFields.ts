import {MigrationInterface, QueryRunner} from "typeorm";

export class UserNullableFields1650398921459 implements MigrationInterface {
    name = 'UserNullableFields1650398921459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_4e7a37098f057689d7cc6a96d9d"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_89523fca908aa0924436995d650"`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "country_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "region_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "visible_for_ad_proposal" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_4e7a37098f057689d7cc6a96d9d" FOREIGN KEY ("country_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_89523fca908aa0924436995d650" FOREIGN KEY ("region_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_89523fca908aa0924436995d650"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_4e7a37098f057689d7cc6a96d9d"`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "visible_for_ad_proposal" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "region_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" ALTER COLUMN "country_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_89523fca908aa0924436995d650" FOREIGN KEY ("region_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_4e7a37098f057689d7cc6a96d9d" FOREIGN KEY ("country_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
