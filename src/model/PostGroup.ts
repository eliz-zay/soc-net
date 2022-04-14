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
} from 'typeorm';

import { Post } from './Post';
import { User } from './User';

export enum EViewType {
    Grid = 'Grid',
    TextBlog = 'TextBlog'
}

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

    @Column({ name: 'view_type', type: 'enum', enum: EViewType, nullable: false })
    viewType: EViewType;

    @Column({ name: 'is_private', type: 'boolean', nullable: false, default: false })
    isPrivate: boolean;

    @OneToMany(() => Post, (post) => post.postGroup)
    posts: Post[];

    @ManyToMany(() => User, (user) => user.joinedPrivateGroups)
    joinedUsers: User[];

    // TODO: user_subscription_id

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
