import {MigrationInterface, QueryRunner} from "typeorm";

export class PostModifications1653387419761 implements MigrationInterface {
    name = 'PostModifications1653387419761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" ADD "tags" character varying(50) array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_42f42b6ed0729f22464f59cbd10"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e"`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "UQ_42f42b6ed0729f22464f59cbd10" UNIQUE ("deal_id")`);
        await queryRunner.query(`ALTER TABLE "c_post" ALTER COLUMN "post_group_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_42f42b6ed0729f22464f59cbd10" FOREIGN KEY ("deal_id") REFERENCES "c_deal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_42f42b6ed0729f22464f59cbd10"`);
        await queryRunner.query(`ALTER TABLE "c_post" ALTER COLUMN "post_group_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "UQ_42f42b6ed0729f22464f59cbd10"`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_42f42b6ed0729f22464f59cbd10" FOREIGN KEY ("deal_id") REFERENCES "c_deal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "tags"`);
    }

}
