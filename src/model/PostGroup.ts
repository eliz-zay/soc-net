import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { Post } from './Post';
import { User } from './User';

export enum ViewType {
    Inst = 'Inst',
    TextBlog = 'TextBlog'
}

@Entity()
export class PostGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'name', type: 'varchar', length: '64', nullable: false })
    name: string;

    @Column({ name: 'preview_url', type: 'varchar', length: '256', nullable: true })
    previewUrl?: string;

    @Column({ name: 'order_number', type: 'int', nullable: true })
    orderNumber: number;

    @Column({ name: 'view_type', type: 'enum', enum: ViewType, nullable: false })
    viewType: ViewType;

    @Column({ name: 'is_private', type: 'boolean', nullable: false, default: false })
    isPrivate: boolean;

    @OneToMany(() => Post, (post) => post.postGroup)
    posts: Post[];

    // TODO: user_subscription_id

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