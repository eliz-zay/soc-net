import express from 'express';
import multer from 'multer';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpDelete, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';

import { UserInfoService } from '../service';
import { PersonalInfoRequest, PreferencesRequest, SuccessResponse } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { checkIfUserActivated } from './middlewares';
import { ErrorMessages } from '../messages';

@ApiPath({
    path: "/user-info",
    name: "User Info",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/user-info')
export class UserInfoController implements interfaces.Controller {
    constructor(@inject("UserInfoService") private userInfoService: UserInfoService) { }

    @ApiOperationPost({
        path: '/personal-info',
        parameters: { body: { required: true, model: "PersonalInfoRequest" } },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPost('/personal-info', makeValidateBody(PersonalInfoRequest))
    private async addPersonalInfo(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: PersonalInfoRequest
    ): Promise<SuccessResponse> {
        await this.userInfoService.addPersonalInfo(req.user, body);

        return { success: true };
    }

    @ApiOperationPatch({
        path: '/profile-photo',
        consumes: ['multipart/form-data'],
        parameters: {
            formData: {
                photo: { type: 'file' },
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/profile-photo', multer().single('photo'))
    private async addProfilePhoto(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const file = req.file;

        if (!file) {
            throw ErrorMessages.ValidationFailed;
        }

        await this.userInfoService.addProfilePhoto(req.user, file);

        return { success: true };
    }

    @ApiOperationPost({
        path: '/preferences',
        parameters: { body: { required: true, model: "PreferencesRequest" } },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPost('/preferences', makeValidateBody(PreferencesRequest))
    private async addPreferences(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: PreferencesRequest
    ): Promise<SuccessResponse> {
        await this.userInfoService.addPreferences(req.user, body);

        return { success: true };
    }
}
