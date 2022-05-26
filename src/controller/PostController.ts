import express from 'express';
import multer from 'multer';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpPatch, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';

import { PostService } from '../service';
import { AddPostRequest, CreatedEntityResponse, PostCommentRequest, PostDetailsResponse, SuccessResponse, UpdatePostRequest } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { checkIfUserActivated } from './middlewares';
import { ErrorMessages } from '../messages';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/profile')
export class PostController implements interfaces.Controller {
    constructor(@inject("PostService") private postService: PostService) { }

    @ApiOperationPost({
        path: '/posts',
        parameters: { body: { required: true, model: "AddPostRequest" } },
        responses: { 200: { model: "CreatedEntityResponse" } }
    })
    @httpPost('/posts', checkIfUserActivated(), makeValidateBody(AddPostRequest))
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
    @httpPatch('/posts/:id/media', checkIfUserActivated(), multer().any())
    private async addPostMedia(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const files = req.files;
        const id = req.params.id;

        if (!files || !Object.values(files).length) {
            throw ErrorMessages.ValidationFailed;
        }

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postService.addMediaToPost(req.user, Number(id), Object.values(files));

        return { success: true };
    }

    @ApiOperationPatch({
        path: '/posts/{id}',
        parameters: {
            body: { required: true, model: "UpdatePostRequest" },
            path: {
                id: {
                    description: 'Post id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/posts/:id', checkIfUserActivated(), makeValidateBody(UpdatePostRequest))
    private async updatePost(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: UpdatePostRequest
    ): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postService.updatePost(req.user, Number(id), body);

        return { success: true };
    }

    @ApiOperationPatch({
        path: '/posts/{id}/like',
        parameters: {
            path: {
                id: {
                    description: 'Post id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/posts/:id/like', checkIfUserActivated())
    private async likePost(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postService.likePost(req.user, Number(id));

        return { success: true };
    }

    @ApiOperationPatch({
        path: '/posts/{id}/comment',
        parameters: {
            body: { required: true, model: "PostCommentRequest" },
            path: {
                id: {
                    description: 'Post id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPatch('/posts/:id/comment', checkIfUserActivated(), makeValidateBody(PostCommentRequest))
    private async commentPost(
        @request() req: express.Request & { user: JwtPayload },
        @requestBody() body: PostCommentRequest
    ): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postService.commentPost(req.user, Number(id), body);

        return { success: true };
    }

    @ApiOperationDelete({
        path: '/posts/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Post id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpDelete('/posts/:id', checkIfUserActivated())
    private async deletePost(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.postService.deletePost(req.user, Number(id));

        return { success: true };
    }

    @ApiOperationGet({
        path: '/posts/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Post id',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: "PostDetailsResponse" } }
    })
    @httpGet('/posts/:id', makeValidateBody(UpdatePostRequest))
    private async getPostDetails(@request() req: express.Request & { user: JwtPayload }): Promise<PostDetailsResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const postDetails = await this.postService.getPostDetails(Number(id));

        return { success: true, data: postDetails };
    }
}
