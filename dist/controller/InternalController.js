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
exports.InternalController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const service_1 = require("./../service/");
const interface_1 = require("../interface");
const helper_1 = require("../helper");
let InternalController = class InternalController {
    constructor(authService) {
        this.authService = authService;
    }
    addPlayerRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id) || id < 1) {
                throw helper_1.ErrorMessages.ValidationFailed;
            }
            return yield this.authService.addRole(id, interface_1.RoleEnum.Player);
        });
    }
    addCustomerRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id) || id < 1) {
                throw helper_1.ErrorMessages.ValidationFailed;
            }
            return yield this.authService.addRole(id, interface_1.RoleEnum.Customer);
        });
    }
    addAdminRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id) || id < 1) {
                throw helper_1.ErrorMessages.ValidationFailed;
            }
            return yield this.authService.addRole(id, interface_1.RoleEnum.Admin);
        });
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/user/{id}/add-player-role/',
        parameters: {
            path: {
                id: {
                    description: 'User id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [] }
    }),
    inversify_express_utils_1.httpGet('/user/:id/add-player-role/'),
    __param(0, inversify_express_utils_1.requestParam("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InternalController.prototype, "addPlayerRole", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/user/{id}/add-customer-role/',
        parameters: {
            path: {
                id: {
                    description: 'User id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [] }
    }),
    inversify_express_utils_1.httpGet('/user/:id/add-customer-role/'),
    __param(0, inversify_express_utils_1.requestParam("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InternalController.prototype, "addCustomerRole", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/user/{id}/add-admin-role/',
        parameters: {
            path: {
                id: {
                    description: 'User id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [] }
    }),
    inversify_express_utils_1.httpGet('/user/:id/add-admin-role/'),
    __param(0, inversify_express_utils_1.requestParam("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InternalController.prototype, "addAdminRole", null);
InternalController = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/internal",
        name: "Internal",
        security: { 'Api-Token': [] }
    }),
    inversify_express_utils_1.controller('/internal'),
    __param(0, inversify_1.inject("AuthService")),
    __metadata("design:paramtypes", [service_1.AuthService])
], InternalController);
exports.InternalController = InternalController;
