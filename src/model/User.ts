import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable
} from "typeorm";

import { Credentials, OtpCode } from '.';
import { Role } from "./Role";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'email', type: 'varchar', length: '100', nullable: false })
    email: string;

    @ManyToMany(() => Role)
    @JoinTable({ joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
    roles: Role[];

    @Column({ name: 'is_email_verified', type: 'boolean', nullable: false, default: false })
    isEmailVerified: boolean;

    @OneToMany(() => OtpCode, (otpCode) => otpCode.user)
    otpCodes: OtpCode[];

    @Column({ name: 'credentials_id', type: 'integer', nullable: false })
    credentialsId: number;

    @OneToOne(() => Credentials)
    @JoinColumn({ name: 'credentials_id' })
    credentials: Credentials;

    @Column({ name: 'is_deleted', type: 'boolean', nullable: false, default: false })
    isDeleted: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
