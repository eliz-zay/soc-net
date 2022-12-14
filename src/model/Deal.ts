import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';

import { User, DealTemplate, Post } from './';

import { EFileType } from '../core';

export enum EDealState {
    Proposal = 'Proposal',
    Declined = 'Declined',
    Discussion = 'Discussion',
    WaitingPost = 'WaitingPost',
    WaitingPayment = 'WaitingPayment',
    Completed = 'Completed'
}

export enum EDealMessageSender {
    Agent = 'Agent',
    Blogger = 'Blogger'
}

export interface DealAttachment {
    type: EFileType;
    url: string;
}

export interface DealMessage {
    date: Date;
    sender: EDealMessageSender;
    text: string;
    attachments: DealAttachment[];
}

@Entity()
export class Deal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'agent_id' })
    agent: User;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'blogger_id' })
    blogger: User;

    @ManyToOne(() => DealTemplate, { nullable: false })
    @JoinColumn({ name: 'template_id' })
    template: DealTemplate;

    @Column({ type: 'enum', enum: EDealState, nullable: false })
    state: EDealState;

    @Column({ type: 'int', nullable: false })
    price: number;

    @Column({ type: 'json', array: true, nullable: false, default: [] })
    chat: DealMessage[];

    @OneToOne(() => Post, (post) => post.deal)
    post: Post;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<Deal>) {
        Object.assign(this, partial);
    }
}
