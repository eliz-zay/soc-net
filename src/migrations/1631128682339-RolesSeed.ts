import {MigrationInterface, QueryRunner} from "typeorm";

export class RolesSeed1631128682339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'INSERT INTO "role"("name", "created_at", "updated_at") VALUES ($1, DEFAULT, DEFAULT), ($2, DEFAULT, DEFAULT), ($3, DEFAULT, DEFAULT) RETURNING "id", "created_at", "updated_at"',
            ['player', 'customer', 'admin']
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `role`");
    }

}
