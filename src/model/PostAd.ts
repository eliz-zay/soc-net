import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToOne
} from 'typeorm';

import { Post, UserSubscription } from './';

@Entity()
export class PostAd {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, { nullable: false })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @OneToOne(() => UserSubscription, { nullable: false })
    @JoinColumn({ name: 'user_subscription_id' })
    userSubscription: UserSubscription;

    @Column({ name: 'is_completed', type: 'boolean', nullable: false })
    isCompleted: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<PostAd>) {
        Object.assign(this, partial);
    }
}
