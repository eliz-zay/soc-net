import { UpdateBasicDescriptionRequest } from './../schema/UpdateBasicDescriptionRequest';
import express from 'express';
import { ApiOperationPatch, ApiPath } from 'swagger-express-ts';
import { interfaces, controller, requestBody, request, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';

import { UserInfoService } from '../service';
import { UserInfoPatchRequest, SuccessResponse } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/profile')
export class ProfileController implements interfaces.Controller {
    constructor(@inject("UserInfoService") private userInfoService: UserInfoService) { }

    @ApiOperationPatch({
        path: '/basic-description',
        parameters: { body: { required: true, model: "UpdateBasicDescriptionRequest" } },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/basic-description', makeValidateBody(UpdateBasicDescriptionRequest))
    private async update(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: UpdateBasicDescriptionRequest
    ): Promise<SuccessResponse> {
        await this.userInfoService.updateBasicDescription(req.user, body);

        return { success: true };
    }
}
