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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const express_class_validator_1 = require("express-class-validator");
const service_1 = require("./../service/");
const schema_1 = require("./../schema/");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signUp(signUpRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = yield this.authService.signUp(signUpRequestSchema);
            return {
                payload: loggedInUser,
                success: true
            };
        });
    }
    signIn(signInRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = yield this.authService.signIn(signInRequestSchema);
            return {
                payload: loggedInUser,
                success: true
            };
        });
    }
    userInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = yield this.authService.getUserInfo(req.user);
            return {
                payload: loggedInUser,
                success: true
            };
        });
    }
    requestEmailVerification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.requestEmailVerification(req.user);
        });
    }
    verifyEmail(req, verifyEmailRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.verifyEmail(req.user, verifyEmailRequestSchema);
        });
    }
    resetPassword(resetPasswordRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.resetPassword(resetPasswordRequestSchema);
        });
    }
    requestPasswordReset(requestPasswordResetRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.requestPasswordReset(requestPasswordResetRequestSchema);
        });
    }
    changePassword(req, changePasswordRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.changePassword(req.user, changePasswordRequestSchema);
        });
    }
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.deleteUser(req.user);
        });
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/sign-up',
        parameters: { body: { required: true, model: "SignUpRequestSchema" } },
        responses: { 200: { model: "LoggedInUserResponse" } }
    }),
    inversify_express_utils_1.httpPost('/sign-up', express_class_validator_1.makeValidateBody(schema_1.SignUpRequestSchema)),
    __param(0, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_1.SignUpRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/sign-in',
        parameters: { body: { required: true, model: "SignInRequestSchema" } },
        responses: { 200: { model: "LoggedInUserResponse" } }
    }),
    inversify_express_utils_1.httpPost('/sign-in', express_class_validator_1.makeValidateBody(schema_1.SignInRequestSchema)),
    __param(0, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_1.SignInRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/user-info',
        responses: { 200: { model: "UserResponse" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    }),
    inversify_express_utils_1.httpGet('/user-info'),
    __param(0, inversify_express_utils_1.request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userInfo", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/request-email-verification',
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    }),
    inversify_express_utils_1.httpGet('/request-email-verification'),
    __param(0, inversify_express_utils_1.request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestEmailVerification", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/verify-email',
        parameters: { body: { required: true, model: "VerifyEmailRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    }),
    inversify_express_utils_1.httpPost('/verify-email', express_class_validator_1.makeValidateBody(schema_1.VerifyEmailRequestSchema)),
    __param(0, inversify_express_utils_1.request()),
    __param(1, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, schema_1.VerifyEmailRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/reset-password',
        parameters: { body: { required: true, model: "ResetPasswordRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } }
    }),
    inversify_express_utils_1.httpPost('/reset-password', express_class_validator_1.makeValidateBody(schema_1.ResetPasswordRequestSchema)),
    __param(0, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_1.ResetPasswordRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/request-password-reset',
        parameters: { body: { required: true, model: "RequestPasswordResetRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } }
    }),
    inversify_express_utils_1.httpPost('/request-password-reset', express_class_validator_1.makeValidateBody(schema_1.RequestPasswordResetRequestSchema)),
    __param(0, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_1.RequestPasswordResetRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/change-password',
        parameters: { body: { required: true, model: "ChangePasswordRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    }),
    inversify_express_utils_1.httpPost('/reset-password', express_class_validator_1.makeValidateBody(schema_1.ChangePasswordRequestSchema)),
    __param(0, inversify_express_utils_1.request()),
    __param(1, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, schema_1.ChangePasswordRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        path: '/delete',
        parameters: {},
        responses: { 200: { model: "SuccessResponseSchema" } }
    }),
    inversify_express_utils_1.httpPost('/delete'),
    __param(0, inversify_express_utils_1.request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "delete", null);
AuthController = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "",
        name: "Auth",
        security: { 'Api-Token': [] }
    }),
    inversify_express_utils_1.controller(''),
    __param(0, inversify_1.inject("AuthService")),
    __metadata("design:paramtypes", [service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
