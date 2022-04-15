import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationsPatch1649963599667 implements MigrationInterface {
    name = 'NotificationsPatch1649963599667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_notification_type" ("code" character varying(100) NOT NULL, "title_template" character varying(100) NOT NULL, "text_template" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1ad215a2be726463af6398a7be5" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "c_mobile_token" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "fcmToken" character varying(500) NOT NULL, CONSTRAINT "PK_a34fd7ddc10b738b5cc20523859" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "content_type"`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "title" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "text" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "data" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "notification_code" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD CONSTRAINT "FK_d1c0cc67bc398b81ab5131ac59b" FOREIGN KEY ("notification_code") REFERENCES "c_notification_type"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_mobile_token" ADD CONSTRAINT "FK_74729ebb1c2ed32cc5171661a21" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_mobile_token" DROP CONSTRAINT "FK_74729ebb1c2ed32cc5171661a21"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP CONSTRAINT "FK_d1c0cc67bc398b81ab5131ac59b"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "notification_code"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "content_type" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD "content" character varying(256) NOT NULL`);
        await queryRunner.query(`DROP TABLE "c_mobile_token"`);
        await queryRunner.query(`DROP TABLE "c_notification_type"`);
    }

}
