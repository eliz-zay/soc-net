import {MigrationInterface, QueryRunner} from "typeorm";

export class MailType1649964212902 implements MigrationInterface {
    name = 'MailType1649964212902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_mail_type" ("code" character varying(100) NOT NULL, "title_template" character varying(100) NOT NULL, "text_template" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d168aa080a40dc168101d8865ca" PRIMARY KEY ("code"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "c_mail_type"`);
    }

}
