import {MigrationInterface, QueryRunner} from "typeorm";

export class Notification1649753017043 implements MigrationInterface {
    name = 'Notification1649753017043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."c_notification_content_type_enum" AS ENUM('Deal', 'Followers')`);
        await queryRunner.query(`CREATE TABLE "c_notification" ("id" SERIAL NOT NULL, "content" character varying(256) NOT NULL, "content_type" "public"."c_notification_content_type_enum" NOT NULL, "read_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_0416df0a1d01342409dc2112818" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD CONSTRAINT "FK_d59f2738533ffb09ace91ea2779" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_notification" DROP CONSTRAINT "FK_d59f2738533ffb09ace91ea2779"`);
        await queryRunner.query(`DROP TABLE "c_notification"`);
        await queryRunner.query(`DROP TYPE "public"."c_notification_content_type_enum"`);
    }

}
