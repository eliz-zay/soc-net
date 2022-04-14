import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";

export enum ENotificationType {
    NewFollower = 'NewFollower',
    EmailVerified = 'EmailVerified',
    FriendJoined = 'FriendJoined',
    NewComment = 'NewComment',
    NewLike = 'NewLike',
    NewDeal = 'NewDeal',
    DealDeclined = 'DealDeclined',
    DealDiscussion = 'DealDiscussion',
    DealWaitingPost = 'DealWaitingPost',
    DealWaitingPayment = 'DealWaitingPayment',
    NewDealMessage = 'NewDealMessage',
}

@Entity()
export class NotificationType {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    code: ENotificationType;

    @Column({ name: 'title_template', type: 'varchar', length: 100, nullable: false })
    titleTemplate: string;

    @Column({ name: 'text_template', type: 'varchar', length: 500, nullable: false })
    textTemplate: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<NotificationType>) {
        Object.assign(this, partial);
    }
}
