import express from 'express';
import multer from 'multer';
import { ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';

import { PostGroupService, UserInfoService } from '../service';
import { AddGroupRequest, CreatedEntityResponse } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { checkIfUserActivated } from './middlewares';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/profile', checkIfUserActivated())
export class PostGroupController implements interfaces.Controller {
    constructor(@inject("PostGroupService") private postGroupService: PostGroupService) { }

    @ApiOperationPost({
        path: '/group',
        parameters: { body: { required: true, model: "AddGroupRequest" } },
        responses: { 200: { model: "CreatedEntityResponse" } }
    })
    @httpPost('/group', makeValidateBody(AddGroupRequest))
    private async addGroup(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: AddGroupRequest
    ): Promise<CreatedEntityResponse> {
        const id = await this.postGroupService.addGroup(req.user, body);

        return { success: true, data: { id } };
    }
}
