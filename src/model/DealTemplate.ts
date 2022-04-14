import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { User } from './User';

@Entity()
export class DealTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.dealTemplates)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: '1000', nullable: false })
    terms: string;

    @Column({ type: 'int', nullable: false })
    price: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<DealTemplate>) {
        Object.assign(this, partial);
    }
}
