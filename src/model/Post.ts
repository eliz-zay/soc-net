import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';

import { User } from './User';
import { PostGroup } from './PostGroup';

export enum MediaType {
    Photo = 'Photo',
    Video = 'Video'
}

export class MediaUrls {
    type: MediaType;
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

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'content', type: 'varchar', length: '10000', nullable: false, default: '' })
    content: string;

    @Column({ name: 'media_urls', type: 'json', array: true, nullable: false, default: [] })
    mediaUrls: MediaUrls[];

    @Column({ name: 'comments', type: 'json', array: true, nullable: false, default: [] })
    comments: Comment[];

    // TODO: user_deal_id

    @ManyToOne(() => PostGroup, (group) => group.posts)
    @JoinColumn({ name: 'post_group_id' })
    postGroup: PostGroup;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToMany(() => User, (user) => user.likedPosts)
    likes: User[];

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
