import {MigrationInterface, QueryRunner} from "typeorm";

export class Post1649696497418 implements MigrationInterface {
    name = 'Post1649696497418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_post" ("id" SERIAL NOT NULL, "content" character varying(10000) NOT NULL DEFAULT '', "media_urls" json array NOT NULL DEFAULT '{}', "comments" json array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_07e4e5ca17d8e3cfc3e2214f75a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_2d5975e9f7fced31de6bcb1aefe" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_2d5975e9f7fced31de6bcb1aefe"`);
        await queryRunner.query(`DROP TABLE "c_post"`);
    }

}
