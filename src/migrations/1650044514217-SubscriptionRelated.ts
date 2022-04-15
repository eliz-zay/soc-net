import {MigrationInterface, QueryRunner} from "typeorm";

export class SubscriptionRelated1650044514217 implements MigrationInterface {
    name = 'SubscriptionRelated1650044514217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_post_ad" ("id" SERIAL NOT NULL, "is_completed" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "post_id" integer NOT NULL, "user_subscription_id" integer NOT NULL, CONSTRAINT "REL_4a86824a60054ab92d8f5d70e3" UNIQUE ("user_subscription_id"), CONSTRAINT "PK_52af0db5313b3e1191f9bb26d1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."c_subscription_billing_type_enum" AS ENUM('PerUsage', 'PerTerm')`);
        await queryRunner.query(`CREATE TABLE "c_subscription" ("code" character varying(100) NOT NULL, "name" character varying(100), "short_description" character varying(1000), "description_html" character varying(100), "price" integer NOT NULL, "billing_period_days" integer, "billing_type" "public"."c_subscription_billing_type_enum" NOT NULL, "specific_info" json NOT NULL DEFAULT '{}', "discount_price" integer, "discount_end" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "parent_code" character varying(100), CONSTRAINT "PK_2ac7444b3b8aad4080144bc5f65" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "c_user_subscription" ("id" SERIAL NOT NULL, "price" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "enabled" boolean NOT NULL, "specific_info" json NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "subscription_code" character varying(100) NOT NULL, CONSTRAINT "PK_ffe4b66639759c91ad1a5c30f51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD "user_subscription_id" integer`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD CONSTRAINT "UQ_27d3a7570b3989b46969e2ea5e4" UNIQUE ("user_subscription_id")`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD CONSTRAINT "FK_27d3a7570b3989b46969e2ea5e4" FOREIGN KEY ("user_subscription_id") REFERENCES "c_user_subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post_ad" ADD CONSTRAINT "FK_784a2b6743e10ebcca347c9fc82" FOREIGN KEY ("post_id") REFERENCES "c_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post_ad" ADD CONSTRAINT "FK_4a86824a60054ab92d8f5d70e3b" FOREIGN KEY ("user_subscription_id") REFERENCES "c_user_subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_subscription" ADD CONSTRAINT "FK_6e57e2bc7eef7c3a9b22b69d494" FOREIGN KEY ("parent_code") REFERENCES "c_subscription"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_subscription" ADD CONSTRAINT "FK_97ca4e8a29e3047abdde640ddb0" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_subscription" ADD CONSTRAINT "FK_c0cdf999f0dacd946c7e736ab80" FOREIGN KEY ("subscription_code") REFERENCES "c_subscription"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_subscription" DROP CONSTRAINT "FK_c0cdf999f0dacd946c7e736ab80"`);
        await queryRunner.query(`ALTER TABLE "c_user_subscription" DROP CONSTRAINT "FK_97ca4e8a29e3047abdde640ddb0"`);
        await queryRunner.query(`ALTER TABLE "c_subscription" DROP CONSTRAINT "FK_6e57e2bc7eef7c3a9b22b69d494"`);
        await queryRunner.query(`ALTER TABLE "c_post_ad" DROP CONSTRAINT "FK_4a86824a60054ab92d8f5d70e3b"`);
        await queryRunner.query(`ALTER TABLE "c_post_ad" DROP CONSTRAINT "FK_784a2b6743e10ebcca347c9fc82"`);
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP CONSTRAINT "FK_27d3a7570b3989b46969e2ea5e4"`);
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP CONSTRAINT "UQ_27d3a7570b3989b46969e2ea5e4"`);
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP COLUMN "user_subscription_id"`);
        await queryRunner.query(`DROP TABLE "c_user_subscription"`);
        await queryRunner.query(`DROP TABLE "c_subscription"`);
        await queryRunner.query(`DROP TYPE "public"."c_subscription_billing_type_enum"`);
        await queryRunner.query(`DROP TABLE "c_post_ad"`);
    }

}
