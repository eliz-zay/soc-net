import {MigrationInterface, QueryRunner} from "typeorm";

export class Tag1653908674127 implements MigrationInterface {
    name = 'Tag1653908674127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_tag" ("code" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a9cfe44eccbb03eeb55dd0db2bc" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "c_user_hobbies_tag" ("user_id" integer NOT NULL, "tag_code" character varying(100) NOT NULL, CONSTRAINT "PK_52a312dd0ebab73b4fbc46bf8ae" PRIMARY KEY ("user_id", "tag_code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7310b049fe1bdfde86e0a6ceeb" ON "c_user_hobbies_tag" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_33a36f91938a42d53c29871d8a" ON "c_user_hobbies_tag" ("tag_code") `);
        await queryRunner.query(`CREATE TABLE "c_post_tags_tag" ("post_id" integer NOT NULL, "tag_code" character varying(100) NOT NULL, CONSTRAINT "PK_b24f541257861d88a9c6065f5f5" PRIMARY KEY ("post_id", "tag_code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d8b2b1cfa6550e67bffd6fe4aa" ON "c_post_tags_tag" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2559bbb488e3614fe25a71e42" ON "c_post_tags_tag" ("tag_code") `);
        await queryRunner.query(`ALTER TABLE "public"."c_user" DROP COLUMN "hobbies"`);
        await queryRunner.query(`ALTER TABLE "public"."c_post" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "c_user_hobbies_tag" ADD CONSTRAINT "FK_7310b049fe1bdfde86e0a6ceeb5" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_user_hobbies_tag" ADD CONSTRAINT "FK_33a36f91938a42d53c29871d8a0" FOREIGN KEY ("tag_code") REFERENCES "c_tag"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post_tags_tag" ADD CONSTRAINT "FK_d8b2b1cfa6550e67bffd6fe4aae" FOREIGN KEY ("post_id") REFERENCES "c_post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_post_tags_tag" ADD CONSTRAINT "FK_d2559bbb488e3614fe25a71e422" FOREIGN KEY ("tag_code") REFERENCES "c_tag"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post_tags_tag" DROP CONSTRAINT "FK_d2559bbb488e3614fe25a71e422"`);
        await queryRunner.query(`ALTER TABLE "c_post_tags_tag" DROP CONSTRAINT "FK_d8b2b1cfa6550e67bffd6fe4aae"`);
        await queryRunner.query(`ALTER TABLE "c_user_hobbies_tag" DROP CONSTRAINT "FK_33a36f91938a42d53c29871d8a0"`);
        await queryRunner.query(`ALTER TABLE "c_user_hobbies_tag" DROP CONSTRAINT "FK_7310b049fe1bdfde86e0a6ceeb5"`);
        await queryRunner.query(`ALTER TABLE "public"."c_post" ADD "tags" character varying(50) array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "public"."c_user" ADD "hobbies" character varying(50) array`);
        await queryRunner.query(`DROP INDEX "IDX_d2559bbb488e3614fe25a71e42"`);
        await queryRunner.query(`DROP INDEX "IDX_d8b2b1cfa6550e67bffd6fe4aa"`);
        await queryRunner.query(`DROP TABLE "c_post_tags_tag"`);
        await queryRunner.query(`DROP INDEX "IDX_33a36f91938a42d53c29871d8a"`);
        await queryRunner.query(`DROP INDEX "IDX_7310b049fe1bdfde86e0a6ceeb"`);
        await queryRunner.query(`DROP TABLE "c_user_hobbies_tag"`);
        await queryRunner.query(`DROP TABLE "c_tag"`);
    }

}
