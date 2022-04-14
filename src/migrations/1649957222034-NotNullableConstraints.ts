import {MigrationInterface, QueryRunner} from "typeorm";

export class NotNullableConstraints1649957222034 implements MigrationInterface {
    name = 'NotNullableConstraints1649957222034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP CONSTRAINT "FK_08523277d8305111a0edb70b51c"`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_2d5975e9f7fced31de6bcb1aefe"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e"`);
        await queryRunner.query(`ALTER TABLE "c_post" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post" ALTER COLUMN "post_group_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP CONSTRAINT "FK_d59f2738533ffb09ace91ea2779"`);
        await queryRunner.query(`ALTER TABLE "c_notification" ALTER COLUMN "read_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" DROP CONSTRAINT "FK_7934e58ab006f0a0d360b6db980"`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD CONSTRAINT "FK_08523277d8305111a0edb70b51c" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_2d5975e9f7fced31de6bcb1aefe" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD CONSTRAINT "FK_d59f2738533ffb09ace91ea2779" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" ADD CONSTRAINT "FK_7934e58ab006f0a0d360b6db980" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_deal_template" DROP CONSTRAINT "FK_7934e58ab006f0a0d360b6db980"`);
        await queryRunner.query(`ALTER TABLE "c_notification" DROP CONSTRAINT "FK_d59f2738533ffb09ace91ea2779"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e"`);
        await queryRunner.query(`ALTER TABLE "c_post" DROP CONSTRAINT "FK_2d5975e9f7fced31de6bcb1aefe"`);
        await queryRunner.query(`ALTER TABLE "c_post_group" DROP CONSTRAINT "FK_08523277d8305111a0edb70b51c"`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_deal_template" ADD CONSTRAINT "FK_7934e58ab006f0a0d360b6db980" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_notification" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ALTER COLUMN "read_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_notification" ADD CONSTRAINT "FK_d59f2738533ffb09ace91ea2779" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ALTER COLUMN "post_group_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_dd1c5612db16d18a61b3c19ed9e" FOREIGN KEY ("post_group_id") REFERENCES "c_post_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post" ADD CONSTRAINT "FK_2d5975e9f7fced31de6bcb1aefe" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "c_post_group" ADD CONSTRAINT "FK_08523277d8305111a0edb70b51c" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
