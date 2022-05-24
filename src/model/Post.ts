import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    OneToOne,
} from 'typeorm';

import { User } from './User';
import { PostGroup } from './PostGroup';
import { Deal } from './Deal';

import { EFileType } from '../core';
import { ETag } from './ETag';

export class MediaUrl {
    type: EFileType;
    url: string;
}

export class Comment {
    userId: number;
    content: string;
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.posts, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'int', nullable: false })
    userId: number;

    @Column({ name: 'content', type: 'varchar', length: '10000', nullable: false, default: '' })
    content: string;

    @Column({ name: 'media_urls', type: 'json', nullable: false, default: [] })
    mediaUrls: MediaUrl[];

    @Column({ name: 'comments', type: 'json', nullable: false, default: [] })
    comments: Comment[];

    @OneToOne(() => Deal, (deal) => deal.post)
    @JoinColumn({ name: 'deal_id' })
    deal?: Deal;

    @Column({ name: 'deal_id', type: 'int', nullable: true })
    dealId?: number;

    @ManyToOne(() => PostGroup, (group) => group.posts, { nullable: true })
    @JoinColumn({ name: 'post_group_id' })
    postGroup?: PostGroup;

    @Column({ name: 'post_group_id', type: 'int', nullable: true })
    postGroupId?: number;

    @ManyToMany(() => User, (user) => user.likedPosts)
    likes: User[];

    @Column({ name: 'tags', type: 'varchar', length: 50, array: true, nullable: false, default: [] })
    tags: ETag[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<Post>) {
        Object.assign(this, partial);
    }
}
