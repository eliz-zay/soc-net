import express from 'express';
import multer from 'multer';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';

import { PostService } from '../service';
import { AddPostRequest, CreatedEntityResponse, SuccessResponse } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { checkIfUserActivated } from './middlewares';
import { ErrorMessages } from '../messages';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/profile', checkIfUserActivated())
export class PostController implements interfaces.Controller {
    constructor(@inject("PostService") private postService: PostService) { }

    @ApiOperationPost({
        path: '/posts',
        parameters: { body: { required: true, model: "AddPostRequest" } },
        responses: { 200: { model: "CreatedEntityResponse" } }
    })
    @httpPost('/posts', makeValidateBody(AddPostRequest))
    private async addPost(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: AddPostRequest
    ): Promise<CreatedEntityResponse> {
        const id = await this.postService.addPost(req.user, body);

        return { success: true, data: { id } };
    }

    @ApiOperationPatch({
        path: '/posts/{id}/media',
        consumes: ['multipart/form-data'],
        parameters: {
            path: {
                id: {
                    description: 'Post id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            },
            formData: {
                media: { type: 'file' },
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/posts/:id/media', multer().any())
    private async addPostMedia(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const files = req.files;
        const id = req.params.id;

        if (!files || !Object.values(files).length) {
            throw ErrorMessages.ValidationFailed;
        }

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postService.addMediaToPhoto(req.user, Number(id), Object.values(files));

        return { success: true };
    }
}
