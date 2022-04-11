import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndGeoModels1649671189400 implements MigrationInterface {
    name = 'UserAndGeoModels1649671189400';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."c_geo_range_enum" AS ENUM('Country', 'Region', 'City')`);
        await queryRunner.query(`CREATE TABLE "c_geo" ("id" integer NOT NULL, "name" character varying(200), "range" "public"."c_geo_range_enum" NOT NULL, "parent_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd554d653d02e7d3d5b1f03d6c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."c_user_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`CREATE TYPE "public"."c_user_profile_filling_stage_enum" AS ENUM('PersonalInfo', 'Preferences', 'AdditionalInfo', 'Filled')`);
        await queryRunner.query(`CREATE TABLE "c_user" ("id" SERIAL NOT NULL, "email" character varying(100) NOT NULL, "salt" character varying(64) NOT NULL, "pass_hash" character varying(1024) NOT NULL, "email_verified_at" TIMESTAMP, "referral_string" character varying(256) NOT NULL, "referrent_id" integer, "referrals_count" integer NOT NULL DEFAULT '0', "otp_codes" json array NOT NULL DEFAULT '{}', "username" character varying(30) NOT NULL, "photo_url" character varying(500), "gender" "public"."c_user_gender_enum", "age" integer, "country_id" integer NOT NULL, "region_id" integer NOT NULL, "city_id" integer, "profile_filling_stage" "public"."c_user_profile_filling_stage_enum", "visible_for_ad_proposal" boolean NOT NULL, "basic_description" character varying(200), "business_description" character varying(1000), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1db33f44ba865e8d518eb433bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_geo" ADD CONSTRAINT "FK_af593ed2b7085d2ec2669b7097e" FOREIGN KEY ("parent_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_4e7a37098f057689d7cc6a96d9d" FOREIGN KEY ("country_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_89523fca908aa0924436995d650" FOREIGN KEY ("region_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user" ADD CONSTRAINT "FK_0666f0643068c296fc4e5ddfe73" FOREIGN KEY ("city_id") REFERENCES "c_geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_0666f0643068c296fc4e5ddfe73"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_89523fca908aa0924436995d650"`);
        await queryRunner.query(`ALTER TABLE "c_user" DROP CONSTRAINT "FK_4e7a37098f057689d7cc6a96d9d"`);
        await queryRunner.query(`ALTER TABLE "c_geo" DROP CONSTRAINT "FK_af593ed2b7085d2ec2669b7097e"`);
        await queryRunner.query(`DROP TABLE "c_user"`);
        await queryRunner.query(`DROP TYPE "public"."c_user_profile_filling_stage_enum"`);
        await queryRunner.query(`DROP TYPE "public"."c_user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "c_geo"`);
        await queryRunner.query(`DROP TYPE "public"."c_geo_range_enum"`);
    }

}
