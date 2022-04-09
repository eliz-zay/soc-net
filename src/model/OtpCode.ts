import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { User } from '.';

@Entity({ name: 'otp_code' })
export class OtpCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', nullable: false })
    code: number;

    @Column({ name: 'expiration_date', type: 'timestamp', nullable: false })
    expirationDate: Date;

    @ManyToOne(() => User, (user) => user.otpCodes)
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<OtpCode>) {
        Object.assign(this, partial);
    }
}
