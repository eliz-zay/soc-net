import express from 'express';
import multer from 'multer';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';

import { PostGroupService } from '../service';
import { AddGroupRequest, CreatedEntityResponse, GroupAndPostsResponse, GroupsResponse, SuccessResponse, UpdateGroupRequest } from '../schema';
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
        path: '/post-groups',
        parameters: { body: { required: true, model: "AddGroupRequest" } },
        responses: { 200: { model: "CreatedEntityResponse" } }
    })
    @httpPost('/post-groups', makeValidateBody(AddGroupRequest))
    private async addGroup(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: AddGroupRequest
    ): Promise<CreatedEntityResponse> {
        const id = await this.postGroupService.addGroup(req.user, body);

        return { success: true, data: { id } };
    }

    @ApiOperationPatch({
        path: '/post-groups/{id}/preview-photo',
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
    @httpPatch('/post-groups/:id/preview-photo', multer().single('photo'))
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
        path: '/post-groups/{id}',
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
    @httpPatch('/post-groups/:id', makeValidateBody(UpdateGroupRequest))
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
        path: '/post-groups/{id}',
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
    @httpDelete('/post-groups/:id')
    private async deleteGroup(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postGroupService.deleteGroup(req.user, Number(id));

        return { success: true };
    }

    @ApiOperationGet({
        path: '/{id}/post-groups',
        parameters: {
            path: {
                id: {
                    description: 'Profile id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "GroupsResponse" } }
    })
    @httpGet('/:id/post-groups')
    private async getGroups(@request() req: express.Request): Promise<GroupsResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const groups = await this.postGroupService.get(Number(id));

        return { success: true, data: { groups } };
    }

    @ApiOperationGet({
        path: '/post-groups/{id}/posts',
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
        responses: { 200: { model: 'GroupAndPostsResponse' } }
    })
    @httpGet('/post-groups/:id/posts')
    private async getGroupAndPosts(@request() req: express.Request & { user: JwtPayload }): Promise<GroupAndPostsResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const groupAndPosts = await this.postGroupService.getGroupAndPosts(req.user, Number(id));

        return { success: true, data: groupAndPosts };
    }
}
