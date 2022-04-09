import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';

import { AuthService } from './../service/';
import {
    SuccessResponseSchema
} from './../schema/';
import { RoleEnum } from '../interface';
import { ErrorMessages } from '../helper';

@ApiPath({
    path: "/internal",
    name: "Internal",
    security: { 'Api-Token': [] }
})
@controller('/internal')
export class InternalController implements interfaces.Controller {
    constructor(@inject("AuthService") private authService: AuthService) { }

    @ApiOperationGet({
        path: '/user/{id}/add-player-role/',
        parameters: {
            path: {
                id: {
                    description: 'User id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [] }
    })
    @httpGet('/user/:id/add-player-role/')
    private async addPlayerRole(@requestParam("id") id: number): Promise<SuccessResponseSchema> {
        if (isNaN(id) || id < 1 ) {
            throw ErrorMessages.ValidationFailed;
        }
        return await this.authService.addRole(id, RoleEnum.Player);
    }

    @ApiOperationGet({
        path: '/user/{id}/add-customer-role/',
        parameters: {
            path: {
                id: {
                    description: 'User id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [] }
    })
    @httpGet('/user/:id/add-customer-role/')
    private async addCustomerRole(@requestParam("id") id: number): Promise<SuccessResponseSchema> {
        if (isNaN(id) || id < 1 ) {
            throw ErrorMessages.ValidationFailed;
        }
        return await this.authService.addRole(id, RoleEnum.Customer);
    }

    @ApiOperationGet({
        path: '/user/{id}/add-admin-role/',
        parameters: {
            path: {
                id: {
                    description: 'User id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [] }
    })
    @httpGet('/user/:id/add-admin-role/')
    private async addAdminRole(@requestParam("id") id: number): Promise<SuccessResponseSchema> {
        if (isNaN(id) || id < 1 ) {
            throw ErrorMessages.ValidationFailed;
        }
        return await this.authService.addRole(id, RoleEnum.Admin);
    }
}
