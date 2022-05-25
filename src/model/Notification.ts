import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { NotificationType, ENotificationType } from './NotificationType';

import { User } from './User';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'int', nullable: false })
    userId: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 500, nullable: false })
    text: string;

    @Column({ type: 'json', nullable: false, default: '{}' })
    data: object;

    @ManyToOne(() => NotificationType, { nullable: false })
    @JoinColumn({ name: 'notification_code', referencedColumnName: 'code' })
    type: NotificationType;

    @Column({ name: 'notification_code', type: 'varchar', length: 100 })
    notificationCode: ENotificationType;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt?: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<Notification>) {
        Object.assign(this, partial);
    }
}
