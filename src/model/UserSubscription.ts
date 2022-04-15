import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { Subscription, User } from './';

export interface UserSubscriptionInfo {
    // TODO
}

@Entity()
export class UserSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Subscription, { nullable: false })
    @JoinColumn({ name: 'subscription_code', referencedColumnName: 'code' })
    subscription: Subscription;

    @Column({ name: 'price', type: 'int', nullable: false })
    price: number;

    @Column({ name: 'start_date', type: 'timestamp', nullable: false })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp', nullable: true })
    endDate?: Date;

    @Column({ name: 'enabled', type: 'boolean', nullable: false })
    enabled: boolean;

    @Column({ name: 'specific_info', type: 'json', nullable: false, default: {} })
    specificInfo: UserSubscriptionInfo;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<UserSubscription>) {
        Object.assign(this, partial);
    }
}
