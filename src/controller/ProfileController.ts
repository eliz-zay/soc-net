import { UpdateBasicDescriptionRequest } from './../schema/UpdateBasicDescriptionRequest';
import express from 'express';
import { ApiOperationPatch, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, requestBody, request, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';

import { UserInfoService, ProfileService } from '../service';
import { ProfileResponse, SuccessResponse } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { ErrorMessages } from '../messages';
import { checkIfUserActivated } from './middlewares';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [] }
})
@controller('/profile')
export class ProfileController implements interfaces.Controller {
    constructor(
        @inject("UserInfoService") private userInfoService: UserInfoService,
        @inject("ProfileService") private profileService: ProfileService
    ) { }

    @ApiOperationPatch({
        path: '/basic-description',
        parameters: { body: { required: true, model: "UpdateBasicDescriptionRequest" } },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/basic-description', checkIfUserActivated(), makeValidateBody(UpdateBasicDescriptionRequest))
    private async update(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: UpdateBasicDescriptionRequest
    ): Promise<SuccessResponse> {
        await this.userInfoService.updateBasicDescription(req.user, body);

        return { success: true };
    }

    @ApiOperationPatch({
        path: '/{id}',
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
        responses: { 200: { model: "ProfileResponse" } }
    })
    @httpPatch('/:id')
    private async getProfile(@request() req: express.Request & { user: JwtPayload }): Promise<ProfileResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        return {
            success: true,
            data: await this.profileService.getProfile(Number(id))
        };
    }
}
