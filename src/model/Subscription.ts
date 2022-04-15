import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

export enum ESubscriptionBillingType {
    PerUsage = 'PerUsage',
    PerTerm = 'PerTerm'
}

export enum EAgencyFilteringLevel {
    Standard = 'Standard',
    Optimal = 'Optimal',
    Premium = 'Premium'
}

export interface SubscriptionInfo {
    usersShown?: number;
    maxDealsPerMonth?: number;
    filteringLevel?: EAgencyFilteringLevel;
    priorityOrder: number;
}

@Entity()
export class Subscription {
    @PrimaryColumn({ name: 'code', type: 'varchar', length: 100, nullable: false })
    code: string;

    @ManyToOne(() => Subscription, { nullable: true })
    @JoinColumn({ name: 'parent_code', referencedColumnName: 'code' })
    parentCode?: string;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name?: string;

    @Column({ name: 'short_description', type: 'varchar', length: 1000, nullable: true })
    shortDescription?: string;

    @Column({ name: 'description_html', type: 'varchar', length: 100, nullable: true })
    descriptionHtml?: string;

    @Column({ name: 'price', type: 'int', nullable: false })
    price: number;

    @Column({ name: 'billing_period_days', type: 'int', nullable: true })
    billingPeriodDays?: number;

    @Column({ name: 'billing_type', type: 'enum', enum: ESubscriptionBillingType, nullable: false })
    billingType: ESubscriptionBillingType;

    @Column({ name: 'specific_info', type: 'json', nullable: false, default: {} })
    specificInfo: SubscriptionInfo;

    @Column({ name: 'discount_price', type: 'int', nullable: true })
    discountPrice?: number;

    @Column({ name: 'discount_end', type: 'timestamp', nullable: true })
    discountEnd?: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    constructor(partial: Partial<Subscription>) {
        Object.assign(this, partial);
    }
}
