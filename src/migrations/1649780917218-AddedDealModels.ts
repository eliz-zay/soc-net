import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDealModels1649780917218 implements MigrationInterface {
    name = 'AddedDealModels1649780917218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_deal_template" ("id" SERIAL NOT NULL, "terms" character varying(1000) NOT NULL, "price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_aed683cb4b9beed7f23daa2b6c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."c_deal_state_enum" AS ENUM('Proposal', 'Declined', 'Discussion', 'WaitingPost', 'WaitingPayment', 'Completed')`);
        await queryRunner.query(`CREATE TABLE "c_deal" ("id" SERIAL NOT NULL, "state" "public"."c_deal_state_enum" NOT NULL, "price" integer NOT NULL, "chat" json array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "agent_id" integer NOT NULL, "blogger_id" integer NOT NULL, "template_id" integer NOT NULL, CONSTRAINT "PK_6b3f4f14f2867840d5abf26cf26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "content_type"`);
        await queryRunner.query(`DROP TYPE "public"."c_notification_content_type_enum"`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "content_type" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" ADD CONSTRAINT "FK_7934e58ab006f0a0d360b6db980" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_deal" ADD CONSTRAINT "FK_25d82e787ef68bd8d6c71de1aac" FOREIGN KEY ("agent_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_deal" ADD CONSTRAINT "FK_d16fad2fee8754e5bf985f1af74" FOREIGN KEY ("blogger_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_deal" ADD CONSTRAINT "FK_aed683cb4b9beed7f23daa2b6c1" FOREIGN KEY ("template_id") REFERENCES "c_deal_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_deal" DROP CONSTRAINT "FK_aed683cb4b9beed7f23daa2b6c1"`);
        await queryRunner.query(`ALTER TABLE "c_deal" DROP CONSTRAINT "FK_d16fad2fee8754e5bf985f1af74"`);
        await queryRunner.query(`ALTER TABLE "c_deal" DROP CONSTRAINT "FK_25d82e787ef68bd8d6c71de1aac"`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" DROP CONSTRAINT "FK_7934e58ab006f0a0d360b6db980"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "content_type"`);
        await queryRunner.query(`CREATE TYPE "public"."c_notification_content_type_enum" AS ENUM('Deal', 'Followers')`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "content_type" "public"."c_notification_content_type_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "c_deal"`);
        await queryRunner.query(`DROP TYPE "public"."c_deal_state_enum"`);
        await queryRunner.query(`DROP TABLE "c_deal_template"`);
    }

}
