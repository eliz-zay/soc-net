import { MigrationInterface, QueryRunner } from "typeorm";

import { MailType } from "../model";
import { mailTypeSeeds } from "./seed-data/mail-types";

export class MailTypesSeed1650397071971 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.manager.insert(MailType, mailTypeSeeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM c_mail_type");
    }
}
