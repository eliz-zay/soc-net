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
exports.VerifyEmailRequestSchema = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let VerifyEmailRequestSchema = class VerifyEmailRequestSchema {
};
__decorate([
    class_validator_1.IsInt(),
    class_transformer_1.Transform((value) => Number(value)),
    swagger_express_ts_1.ApiModelProperty({ required: true }),
    __metadata("design:type", Number)
], VerifyEmailRequestSchema.prototype, "otpCode", void 0);
VerifyEmailRequestSchema = __decorate([
    swagger_express_ts_1.ApiModel()
], VerifyEmailRequestSchema);
exports.VerifyEmailRequestSchema = VerifyEmailRequestSchema;
