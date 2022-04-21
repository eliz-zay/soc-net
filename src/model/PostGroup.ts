import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    OneToOne,
} from 'typeorm';

import { Post, User, UserSubscription } from './';

export enum EGroupViewType {
    Grid = 'Grid',
    TextBlog = 'TextBlog'
}

export const KDefaultPostGroupName = 'Группа 1';

@Entity()
export class PostGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.groups, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'name', type: 'varchar', length: '64', nullable: false })
    name: string;

    @Column({ name: 'preview_url', type: 'varchar', length: '256', nullable: true })
    previewUrl?: string;

    @Column({ name: 'order_number', type: 'int', nullable: true })
    orderNumber: number;

    @Column({ name: 'view_type', type: 'enum', enum: EGroupViewType, nullable: false })
    viewType: EGroupViewType;

    @Column({ name: 'is_private', type: 'boolean', nullable: false, default: false })
    isPrivate: boolean;

    @OneToMany(() => Post, (post) => post.postGroup)
    posts: Post[];

    @ManyToMany(() => User, (user) => user.joinedPrivateGroups)
    joinedUsers: User[];

    @OneToOne(() => UserSubscription, { nullable: true })
    @JoinColumn({ name: 'user_subscription_id' })
    userSubscription?: UserSubscription;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<PostGroup>) {
        Object.assign(this, partial);
    }
}
