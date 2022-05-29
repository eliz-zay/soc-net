import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    OneToMany,
    JoinTable,
} from "typeorm";

import { Geo } from '.';
import { Post } from './Post';
import { PostGroup } from './PostGroup';
import { Notification } from './Notification';
import { DealTemplate } from "./DealTemplate";
import { ETag } from "./ETag";

export class OtpCode {
    code: number;
    generationDate: Date;
    expirationDate: Date;
}

export enum EUserGender {
    Male = 'Male',
    Female = 'Female'
}

export enum EProfileFillingStage {
    PersonalInfo = 'PersonalInfo',
    Preferences = 'Preferences',
    AdditionalInfo = 'AdditionalInfo',
    Filled = 'Filled'
}

export enum EOccupation {
    Student = 'Student',
    Working = 'Working',
    Blogger = 'Blogger',
    Businessman = 'Businessman',
    Company = 'Company'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '50', nullable: true })
    name?: string;

    @Column({ type: 'varchar', length: '30', nullable: false })
    username: string;

    @Column({ name: 'email', type: 'varchar', length: '100', nullable: false })
    email: string;

    @Column({ type: 'varchar', length: '64', nullable: false })
    salt: string;

    @Column({ name: 'pass_hash', type: 'varchar', length: '1024', nullable: false })
    passHash: string;

    @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
    emailVerifiedAt?: Date;

    @Column({ name: 'referral_string', type: 'varchar', length: '256', nullable: false })
    referralString: string;

    @Column({ name: 'referrent_id', type: 'int', nullable: true })
    referrentId?: number;

    @Column({ name: 'referrals_count', type: 'int', nullable: false, default: 0 })
    referralsСount: number;

    @Column({ name: 'otp_codes', type: 'json', nullable: false, default: [] })
    otpCodes: OtpCode[];

    @Column({ name: 'photo_url', type: 'varchar', length: '500', nullable: true })
    photoUrl?: string;

    @Column({ type: 'enum', enum: EUserGender, nullable: true })
    gender?: EUserGender;

    @Column({ type: 'date', nullable: true })
    birthday?: Date;

    @Column({ name: 'country_id', type: 'int', nullable: true })
    countryId?: number;

    @ManyToOne(() => Geo, { nullable: false })
    @JoinColumn({ name: "country_id" })
    country?: Geo;

    @Column({ name: 'region_id', type: 'int', nullable: true })
    regionId?: number;

    @ManyToOne(() => Geo, { nullable: false })
    @JoinColumn({ name: "region_id" })
    region?: Geo;

    @Column({ name: 'city_id', type: 'int', nullable: true })
    cityId?: number;

    @ManyToOne(() => Geo, { nullable: true })
    @JoinColumn({ name: "city_id" })
    city?: Geo;

    @Column({ name: 'profile_filling_stage', type: 'enum', enum: EProfileFillingStage, nullable: false, default: EProfileFillingStage.PersonalInfo })
    profileFillingStage: EProfileFillingStage;

    @Column({ type: 'varchar', length: 50, nullable: true })
    occupation?: EOccupation;

    @Column({ type: 'varchar', length: 50, array: true, nullable: true })
    hobbies?: ETag[];

    @Column({ name: 'visible_for_ad_proposal', type: 'boolean', nullable: true })
    visibleForAdProposal?: boolean;

    @Column({ name: 'wants_to_use_business_profile', type: 'boolean', nullable: true })
    wantsToUseBusinessProfile?: boolean;

    @Column({ name: 'basic_description', type: 'varchar', length: '200', nullable: true })
    basicDescription?: string;

    @Column({ name: 'business_description', type: 'varchar', length: '1000', nullable: true })
    businessDescription?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    telegram?: string;

    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable({ joinColumn: { name: 'follower_id' }, inverseJoinColumn: { name: 'followee_id' } })
    followees: User[];

    @ManyToMany(() => User, (user) => user.followees)
    followers: User[];

    @ManyToMany(() => Post, (post) => post.likes)
    @JoinTable({ joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'post_id' } })
    likedPosts: Post[];

    @ManyToMany(() => PostGroup, (group) => group.joinedUsers)
    @JoinTable({ joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'post_group_id' } })
    joinedPrivateGroups: PostGroup[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => PostGroup, (group) => group.user)
    groups: PostGroup[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @OneToMany(() => DealTemplate, (dealTemplate) => dealTemplate.user)
    dealTemplates: DealTemplate[];

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
