import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryColumn,
    UpdateDateColumn,
    ManyToMany
} from 'typeorm';

import { User, Post } from '.';

export enum ETag {
    IT = 'IT',
    Cooking = 'Cooking',
    Travelling = 'Travelling',
    Architecture = 'Architecture',
    Art = 'Art',
    Music = 'Music',
    Business = 'Business',
    Nature = 'Nature'
}

@Entity()
export class Tag {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    code: ETag;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @ManyToMany(() => User, (user) => user.hobbies)
    users: User[];

    @ManyToMany(() => Post, (post) => post.tags)
    posts: Post[];

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<Tag>) {
        Object.assign(this, partial);
    }
}
