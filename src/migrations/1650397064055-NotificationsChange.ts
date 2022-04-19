import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationsChange1650397064055 implements MigrationInterface {
    name = 'NotificationsChange1650397064055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_notification_type" ALTER COLUMN "text_template" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_notification_type" ALTER COLUMN "text_template" SET NOT NULL`);
    }

}
