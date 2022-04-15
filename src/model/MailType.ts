import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";

export enum EMailType {
    VerifyAccount = 'VerifyAccount',
    VerifyChangeEmail = 'VerifyChangeEmail',
    VerifyPasswordReset = 'VerifyPasswordReset',
}

@Entity()
export class MailType {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    code: EMailType;

    @Column({ name: 'title_template', type: 'varchar', length: 100, nullable: false })
    titleTemplate: string;

    @Column({ name: 'text_template', type: 'varchar', length: 500, nullable: false })
    textTemplate: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<MailType>) {
        Object.assign(this, partial);
    }
}
