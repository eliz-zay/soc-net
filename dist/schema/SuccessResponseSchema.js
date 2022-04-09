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
exports.SuccessResponseSchema = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let SuccessResponseSchema = class SuccessResponseSchema {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({ required: true }),
    __metadata("design:type", Boolean)
], SuccessResponseSchema.prototype, "success", void 0);
SuccessResponseSchema = __decorate([
    swagger_express_ts_1.ApiModel()
], SuccessResponseSchema);
exports.SuccessResponseSchema = SuccessResponseSchema;
