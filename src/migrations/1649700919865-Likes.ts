import {MigrationInterface, QueryRunner} from "typeorm";

export class Likes1649700919865 implements MigrationInterface {
    name = 'Likes1649700919865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" DROP CONSTRAINT "FK_2390a6f64ccf6698984d124880f"`);
        await queryRunner.query(`CREATE TABLE "c_user_liked_posts_post" ("user_id" integer NOT NULL, "post_id" integer NOT NULL, CONSTRAINT "PK_62abb6391d258ade9032d3f5bf7" PRIMARY KEY ("user_id", "post_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c98aee4bc70ab6700679847f31" ON "c_user_liked_posts_post" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_da979777a81a923e72093e3827" ON "c_user_liked_posts_post" ("post_id") `);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" ADD CONSTRAINT "FK_2390a6f64ccf6698984d124880f" FOREIGN KEY ("followee_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" ADD CONSTRAINT "FK_c98aee4bc70ab6700679847f31c" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" ADD CONSTRAINT "FK_da979777a81a923e72093e3827a" FOREIGN KEY ("post_id") REFERENCES "c_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" DROP CONSTRAINT "FK_da979777a81a923e72093e3827a"`);
        await queryRunner.query(`ALTER TABLE "c_user_liked_posts_post" DROP CONSTRAINT "FK_c98aee4bc70ab6700679847f31c"`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" DROP CONSTRAINT "FK_2390a6f64ccf6698984d124880f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da979777a81a923e72093e3827"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c98aee4bc70ab6700679847f31"`);
        await queryRunner.query(`DROP TABLE "c_user_liked_posts_post"`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" ADD CONSTRAINT "FK_2390a6f64ccf6698984d124880f" FOREIGN KEY ("followee_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
