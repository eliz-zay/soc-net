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
exports.transformToUserSchema = exports.UserSchema = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let UserSchema = class UserSchema {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({ required: true }),
    __metadata("design:type", Number)
], UserSchema.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({ required: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.Response.Type.ARRAY,
        itemType: swagger_express_ts_1.SwaggerDefinitionConstant.Response.Type.STRING
    }),
    __metadata("design:type", Array)
], UserSchema.prototype, "roles", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({ required: true }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "isEmailVerified", void 0);
UserSchema = __decorate([
    swagger_express_ts_1.ApiModel()
], UserSchema);
exports.UserSchema = UserSchema;
function transformToUserSchema(user) {
    const { id, email, roles, isEmailVerified } = user;
    const schema = {
        id,
        email,
        roles: roles.map((role) => role.name),
        isEmailVerified: !!isEmailVerified
    };
    return schema;
}
exports.transformToUserSchema = transformToUserSchema;
