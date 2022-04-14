import {MigrationInterface, QueryRunner} from "typeorm";

export class PostDeal1649955742588 implements MigrationInterface {
    name = 'PostDeal1649955742588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" ADD "deal_id" integer`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_42f42b6ed0729f22464f59cbd10" FOREIGN KEY ("deal_id") REFERENCES "c_deal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_42f42b6ed0729f22464f59cbd10"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "deal_id"`);
    }

}
