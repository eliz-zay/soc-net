import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { User } from "./User";

@Entity()
export class MobileToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int', nullable: false })
    userId: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 500, nullable: false })
    fcmToken: string;

    constructor(partial: Partial<MobileToken>) {
        Object.assign(this, partial);
    }
}
