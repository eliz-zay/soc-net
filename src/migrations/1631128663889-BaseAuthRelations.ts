import {MigrationInterface, QueryRunner} from "typeorm";

export class BaseAuthRelations1631128663889 implements MigrationInterface {
    name = 'BaseAuthRelations1631128663889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credentials" ("id" SERIAL NOT NULL, "salt" character varying(64) NOT NULL, "hash" character varying(1024) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(100) NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "credentials_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_5cadc04d03e2d9fe76e1b44eb3" UNIQUE ("credentials_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp_code" ("id" SERIAL NOT NULL, "code" integer NOT NULL, "expiration_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_c2c773c7da0f03da4a23c4066a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_cbb8cdf197992a93da55155c14e" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_09d115a69b6014d324d592f9c4" ON "user_roles_role" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e2f5483d5e8d52043f9763453" ON "user_roles_role" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5cadc04d03e2d9fe76e1b44eb34" FOREIGN KEY ("credentials_id") REFERENCES "credentials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp_code" ADD CONSTRAINT "FK_48f78465fa5f22ceaaa2175b168" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_09d115a69b6014d324d592f9c42" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_0e2f5483d5e8d52043f97634538" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_0e2f5483d5e8d52043f97634538"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_09d115a69b6014d324d592f9c42"`);
        await queryRunner.query(`ALTER TABLE "otp_code" DROP CONSTRAINT "FK_48f78465fa5f22ceaaa2175b168"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5cadc04d03e2d9fe76e1b44eb34"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d68c31fd20f9037ac7eccc16ddb"`);
        await queryRunner.query(`DROP INDEX "IDX_0e2f5483d5e8d52043f9763453"`);
        await queryRunner.query(`DROP INDEX "IDX_09d115a69b6014d324d592f9c4"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "otp_code"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "credentials"`);
    }

}
