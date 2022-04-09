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
exports.RequestPasswordResetRequestSchema = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const class_validator_1 = require("class-validator");
let RequestPasswordResetRequestSchema = class RequestPasswordResetRequestSchema {
};
__decorate([
    class_validator_1.IsEmail(),
    class_validator_1.MaxLength(40),
    swagger_express_ts_1.ApiModelProperty({ required: true }),
    __metadata("design:type", String)
], RequestPasswordResetRequestSchema.prototype, "email", void 0);
RequestPasswordResetRequestSchema = __decorate([
    swagger_express_ts_1.ApiModel()
], RequestPasswordResetRequestSchema);
exports.RequestPasswordResetRequestSchema = RequestPasswordResetRequestSchema;
