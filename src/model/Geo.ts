import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    PrimaryColumn
} from "typeorm";

export enum EGeoRange {
    Country = 'Country',
    Region = 'Region',
    City = 'City'
}

@Entity()
export class Geo {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar', length: '200', nullable: true })
    name: string;

    @Column({ name: 'range', type: 'enum', enum: EGeoRange, nullable: false })
    range: EGeoRange;

    @Column({ name: 'parent_id', type: 'int', nullable: true })
    parentId?: number;

    @ManyToOne(() => Geo, (geo) => geo.children, { nullable: true })
    @JoinColumn({ name: "parent_id" })
    parent?: Geo;

    @OneToMany(() => Geo, (geo) => geo.parent)
    children: Geo[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @UpdateDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;

    constructor(partial: Partial<Geo>) {
        Object.assign(this, partial);
    }
}
