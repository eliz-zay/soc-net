"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
const Role_1 = require("./Role");
let User = class User {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'email', type: 'varchar', length: '100', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Role_1.Role),
    typeorm_1.JoinTable({ joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    typeorm_1.Column({ name: 'is_email_verified', type: 'boolean', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    typeorm_1.OneToMany(() => _1.OtpCode, (otpCode) => otpCode.user),
    __metadata("design:type", Array)
], User.prototype, "otpCodes", void 0);
__decorate([
    typeorm_1.Column({ name: 'credentials_id', type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "credentialsId", void 0);
__decorate([
    typeorm_1.OneToOne(() => _1.Credentials),
    typeorm_1.JoinColumn({ name: 'credentials_id' }),
    __metadata("design:type", _1.Credentials)
], User.prototype, "credentials", void 0);
__decorate([
    typeorm_1.Column({ name: 'is_deleted', type: 'boolean', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
