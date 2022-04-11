import {MigrationInterface, QueryRunner} from "typeorm";

export class PostAndPostGroup1649698540888 implements MigrationInterface {
    name = 'PostAndPostGroup1649698540888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."c_post_group_view_type_enum" AS ENUM('Inst', 'TextBlog')`);
        await queryRunner.query(`CREATE TABLE "c_post_group" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "preview_url" character varying(256), "order_number" integer, "view_type" "public"."c_post_group_view_type_enum" NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_93980af0cffcb36b71fd1eff9c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD "post_group_id" integer`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD CONSTRAINT "FK_08523277d8305111a0edb70b51c" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP CONSTRAINT "FK_08523277d8305111a0edb70b51c"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "post_group_id"`);
        await queryRunner.query(`DROP TABLE "c_post_group"`);
        await queryRunner.query(`DROP TYPE "public"."c_post_group_view_type_enum"`);
    }

}
