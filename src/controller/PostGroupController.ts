import express from 'express';
import multer from 'multer';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';

import { PostGroupService } from '../service';
import { AddGroupRequest, CreatedEntityResponse, GroupsResponse, SuccessResponse, UpdateGroupRequest } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { checkIfUserActivated } from './middlewares';
import { ErrorMessages } from '../messages';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/profile', checkIfUserActivated())
export class PostGroupController implements interfaces.Controller {
    constructor(@inject("PostGroupService") private postGroupService: PostGroupService) { }

    @ApiOperationPost({
        path: '/groups',
        parameters: { body: { required: true, model: "AddGroupRequest" } },
        responses: { 200: { model: "CreatedEntityResponse" } }
    })
    @httpPost('/groups', makeValidateBody(AddGroupRequest))
    private async addGroup(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: AddGroupRequest
    ): Promise<CreatedEntityResponse> {
        const id = await this.postGroupService.addGroup(req.user, body);

        return { success: true, data: { id } };
    }

    @ApiOperationPatch({
        path: '/groups/{id}/preview-photo',
        consumes: ['multipart/form-data'],
        parameters: {
            path: {
                id: {
                    description: 'Group id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            },
            formData: {
                photo: { type: 'file' },
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/groups/:id/preview-photo', multer().single('photo'))
    private async addGroupPreviewPhoto(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const file = req.file;
        const id = req.params.id;

        if (!file) {
            throw ErrorMessages.ValidationFailed;
        }

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postGroupService.addGroupPreviewPhoto(req.user, Number(id), file);

        return { success: true };
    }

    @ApiOperationPatch({
        path: '/groups/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Group id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                },
            },
            body: { required: true, model: "UpdateGroupRequest" }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/groups/:id', makeValidateBody(UpdateGroupRequest))
    private async updateGroup(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: UpdateGroupRequest
    ): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postGroupService.updateGroup(req.user, Number(id), body);

        return { success: true };
    }

    @ApiOperationDelete({
        path: '/groups/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Group id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpDelete('/groups/:id')
    private async deleteGroup(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postGroupService.deleteGroup(req.user, Number(id));

        return { success: true };
    }

    @ApiOperationGet({
        path: '/groups',
        parameters: {},
        responses: { 200: { model: "GroupsResponse" } }
    })
    @httpGet('/groups')
    private async getGroups(@request() req: express.Request & { user: JwtPayload }): Promise<GroupsResponse> {
        const groups = await this.postGroupService.get(req.user);

        return { success: true, data: { groups } };
    }
}
