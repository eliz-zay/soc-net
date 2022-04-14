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

export enum ENotificationType {
    NewFollower = 'NewFollower',
    NewDeal = 'NewDeal',
    DealStatusChanged = 'DealStatusChanged',
    NewDealMessage = 'NewDealMessage',
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'content', type: 'varchar', length: '256', nullable: false })
    content: string;

    @Column({ name: 'content_type', type: 'varchar', length: '32', nullable: false })
    contentType: ENotificationType;

    @Column({ name: 'read_at', type: 'timestamp' })
    readAt: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
