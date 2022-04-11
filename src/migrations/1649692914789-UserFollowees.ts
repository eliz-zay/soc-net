import {MigrationInterface, QueryRunner} from "typeorm";

export class UserFollowees1649692914789 implements MigrationInterface {
    name = 'UserFollowees1649692914789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_user_followees_user" ("follower_id" integer NOT NULL, "followee_id" integer NOT NULL, CONSTRAINT "PK_a1c9b4279eb47cead9bbf493272" PRIMARY KEY ("follower_id", "followee_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99f90ad4b9060648d1620088ec" ON "c_user_followees_user" ("follower_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2390a6f64ccf6698984d124880" ON "c_user_followees_user" ("followee_id") `);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" ADD CONSTRAINT "FK_99f90ad4b9060648d1620088ec3" FOREIGN KEY ("follower_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" ADD CONSTRAINT "FK_2390a6f64ccf6698984d124880f" FOREIGN KEY ("followee_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" DROP CONSTRAINT "FK_2390a6f64ccf6698984d124880f"`);
        await queryRunner.query(`ALTER TABLE "c_user_followees_user" DROP CONSTRAINT "FK_99f90ad4b9060648d1620088ec3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2390a6f64ccf6698984d124880"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99f90ad4b9060648d1620088ec"`);
        await queryRunner.query(`DROP TABLE "c_user_followees_user"`);
    }

}
