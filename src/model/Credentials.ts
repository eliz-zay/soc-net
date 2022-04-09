import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Credentials {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '64', nullable: false })
    salt: string;

    @Column({ type: 'varchar', length: '1024', nullable: false })
    hash: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    constructor(partial: Partial<Credentials>) {
        Object.assign(this, partial);
    }
}
