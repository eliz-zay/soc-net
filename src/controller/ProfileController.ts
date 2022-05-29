import express from 'express';
import { ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, requestBody, request, httpPatch, httpPost, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { UserInfoService, ProfileService } from '../service';
import { UpdateBasicDescriptionRequest, ProfileResponse, ProfileSummariesResponse, SuccessResponse } from '../schema';
import { JwtPayload, makeValidateBody } from '../core';
import { ErrorMessages } from '../messages';
import { checkIfUserActivated } from './middlewares';

@ApiPath({
    path: "/profile",
    name: "Profile",
    security: { 'Api-Key': [], 'Authorization': [] }
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

    @ApiOperationGet({
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
    @httpGet('/:id')
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

    @ApiOperationPost({
        path: '/{id}/follow',
        parameters: {
            path: {
                id: {
                    description: 'User id to follow',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                }
            }
        },
        responses: { 200: { model: 'SuccessResponse' } }
    })
    @httpPost('/:id/follow', checkIfUserActivated())
    private async follow(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        await this.profileService.follow(req.user, Number(id));

        return { success: true };
    }

    @ApiOperationGet({
        path: '/{id}/followers',
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
        responses: { 200: { model: 'ProfileSummariesResponse' } }
    })
    @httpGet('/:id/followers')
    private async getFollowers(@request() req: express.Request): Promise<ProfileSummariesResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const followers = await this.profileService.getFollowers(Number(id));

        return { success: true, data: followers };
    }

    @ApiOperationGet({
        path: '/{id}/followees',
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
        responses: { 200: { model: 'ProfileSummariesResponse' } }
    })
    @httpGet('/:id/followees')
    private async getFollowees(@request() req: express.Request): Promise<ProfileSummariesResponse> {
        const id = req.params.id;

        if (!Number(id) || Number(id) <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const followees = await this.profileService.getFollowees(Number(id));

        return { success: true, data: followees };
    }
}
