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
exports.OtpCode = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
let OtpCode = class OtpCode {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OtpCode.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], OtpCode.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ name: 'expiration_date', type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], OtpCode.prototype, "expirationDate", void 0);
__decorate([
    typeorm_1.ManyToOne(() => _1.User, (user) => user.otpCodes),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", _1.User)
], OtpCode.prototype, "user", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OtpCode.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OtpCode.prototype, "updatedAt", void 0);
OtpCode = __decorate([
    typeorm_1.Entity({ name: 'otp_code' }),
    __metadata("design:paramtypes", [Object])
], OtpCode);
exports.OtpCode = OtpCode;
