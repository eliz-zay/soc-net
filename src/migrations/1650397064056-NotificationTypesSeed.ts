import { MigrationInterface, QueryRunner } from "typeorm";

import { NotificationType } from "../model";
import { notificationTypeSeeds } from "./seed-data/notification-types";

export class NotificationTypesSeed1650397064056 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.manager.insert(NotificationType, notificationTypeSeeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM c_notification_type");
    }
}
