import {MigrationInterface, QueryRunner} from "typeorm";

export class PostGroupOrderNotNullable1650712330535 implements MigrationInterface {
    name = 'PostGroupOrderNotNullable1650712330535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post_group" ALTER COLUMN "order_number" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_post_group" ALTER COLUMN "order_number" DROP NOT NULL`);
    }

}
