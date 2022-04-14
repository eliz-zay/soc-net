import {MigrationInterface, QueryRunner} from "typeorm";

export class PostAndGroupAndPrivateGroupAndLikes1649752398208 implements MigrationInterface {
    name = 'PostAndGroupAndPrivateGroupAndLikes1649752398208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" DROP CONSTRAINT "FK_2390a6f64ccf6698984d124880f"`);
        await queryRunner.query(`CREATE TYPE "public"."c_post_group_view_type_enum" AS ENUM('Grid', 'TextBlog')`);
        await queryRunner.query(`CREATE TABLE "c_post_group" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "preview_url" character varying(256), "order_number" integer, "view_type" "public"."c_post_group_view_type_enum" NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_93980af0cffcb36b71fd1eff9c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "c_user_liked_posts_post" ("user_id" integer NOT NULL, "post_id" integer NOT NULL, CONSTRAINT "PK_62abb6391d258ade9032d3f5bf7" PRIMARY KEY ("user_id", "post_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c98aee4bc70ab6700679847f31" ON "c_user_liked_posts_post" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_da979777a81a923e72093e3827" ON "c_user_liked_posts_post" ("post_id") `);
        await queryRunner.query(`CREATE TABLE "c_user_joined_private_groups_post_group" ("user_id" integer NOT NULL, "post_group_id" integer NOT NULL, CONSTRAINT "PK_7ad4f450be8bdc8a541140377e6" PRIMARY KEY ("user_id", "post_group_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d40b56fde19584ce40b56e2a62" ON "c_user_joined_private_groups_post_group" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2643eb986791ac09875aaf0c7a" ON "c_user_joined_private_groups_post_group" ("post_group_id") `);
        await queryRunner.query(`ALTER TABLE "c_post" ADD "post_group_id" integer`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD CONSTRAINT "FK_08523277d8305111a0edb70b51c" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" ADD CONSTRAINT "FK_2390a6f64ccf6698984d124880f" FOREIGN KEY ("followee_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" ADD CONSTRAINT "FK_c98aee4bc70ab6700679847f31c" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" ADD CONSTRAINT "FK_da979777a81a923e72093e3827a" FOREIGN KEY ("post_id") REFERENCES "c_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_joined_private_groups_post_group" ADD CONSTRAINT "FK_d40b56fde19584ce40b56e2a627" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_user_joined_private_groups_post_group" ADD CONSTRAINT "FK_2643eb986791ac09875aaf0c7af" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_joined_private_groups_post_group" DROP CONSTRAINT "FK_2643eb986791ac09875aaf0c7af"`);
        await queryRunner.query(`ALTER TABLE "c_user_joined_private_groups_post_group" DROP CONSTRAINT "FK_d40b56fde19584ce40b56e2a627"`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" DROP CONSTRAINT "FK_da979777a81a923e72093e3827a"`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" DROP CONSTRAINT "FK_c98aee4bc70ab6700679847f31c"`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" DROP CONSTRAINT "FK_2390a6f64ccf6698984d124880f"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e"`);
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP CONSTRAINT "FK_08523277d8305111a0edb70b51c"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP COLUMN "post_group_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2643eb986791ac09875aaf0c7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d40b56fde19584ce40b56e2a62"`);
        await queryRunner.query(`DROP TABLE "c_user_joined_private_groups_post_group"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da979777a81a923e72093e3827"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c98aee4bc70ab6700679847f31"`);
        await queryRunner.query(`DROP TABLE "c_user_liked_posts_post"`);
        await queryRunner.query(`DROP TABLE "c_post_group"`);
        await queryRunner.query(`DROP TYPE "public"."c_post_group_view_type_enum"`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" ADD CONSTRAINT "FK_2390a6f64ccf6698984d124880f" FOREIGN KEY ("followee_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
