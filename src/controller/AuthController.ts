import express from 'express';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';

import { AuthService } from './../service/';
import {
    SignUpRequest,
    SignInRequest,
    VerifyEmailRequest,
    SuccessResponse,
    RequestPasswordResetRequest,
    ResetPasswordRequest,
    LoggedInUserResponse,
    UserResponse,
    ChangePasswordRequest
} from './../schema/';
import { JwtPayload, makeValidateBody } from '../core';
import { checkIfUserActivated } from './middlewares';

@ApiPath({
    path: "/auth",
    name: "Auth",
    security: { 'Api-Key': [] }
})
@controller('/auth')
export class AuthController implements interfaces.Controller {
    constructor(@inject("AuthService") private authService: AuthService) { }

    @ApiOperationPost({
        path: '/sign-up',
        parameters: { body: { required: true, model: "SignUpRequest" } },
        responses: { 200: { model: "LoggedInUserResponse" } }
    })
    @httpPost('/sign-up', makeValidateBody(SignUpRequest))
    private async signUp(@requestBody() body: SignUpRequest): Promise<LoggedInUserResponse> {
        const loggedInUser = await this.authService.signUp(body);

        return {
            data: loggedInUser,
            success: true
        };
    }

    @ApiOperationPost({
        path: '/sign-in',
        parameters: { body: { required: true, model: "SignInRequest" } },
        responses: { 200: { model: "LoggedInUserResponse" } }
    })
    @httpPost('/sign-in', makeValidateBody(SignInRequest))
    private async signIn(@requestBody() body: SignInRequest): Promise<LoggedInUserResponse> {
        const loggedInUser = await this.authService.signIn(body);

        return {
            data: loggedInUser,
            success: true
        };
    }

    @ApiOperationGet({
        path: '/user-info',
        responses: { 200: { model: "UserResponse" } },
        security: { 'Api-Key': [], 'Authorization': [] }
    })
    @httpGet('/user-info')
    private async userInfo(@request() req: express.Request & { user: JwtPayload }): Promise<UserResponse> {
        const loggedInUser = await this.authService.getUserInfo(req.user);

        return {
            data: loggedInUser,
            success: true
        };
    }

    @ApiOperationGet({
        path: '/request-email-verification',
        responses: { 200: { model: "SuccessResponse" } },
        security: { 'Api-Key': [], 'Authorization': [] }
    })
    @httpGet('/request-email-verification')
    private async requestEmailVerification(@request() req: any): Promise<SuccessResponse> {
        return await this.authService.requestEmailVerification(req.user);
    }

    @ApiOperationPost({
        path: '/verify-email',
        parameters: { body: { required: true, model: "VerifyEmailRequest" } },
        responses: { 200: { model: "SuccessResponse" } },
        security: { 'Api-Key': [], 'Authorization': [] }
    })
    @httpPost('/verify-email', makeValidateBody(VerifyEmailRequest))
    private async verifyEmail(
        @request() req: any,
        @requestBody() body: VerifyEmailRequest
    ): Promise<SuccessResponse> {
        return await this.authService.verifyEmail(req.user, body);
    }

    @ApiOperationPost({
        path: '/reset-password',
        parameters: { body: { required: true, model: "ResetPasswordRequest" } },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPost('/reset-password', makeValidateBody(ResetPasswordRequest))
    private async resetPassword(
        @requestBody() body: ResetPasswordRequest
    ): Promise<SuccessResponse> {
        return await this.authService.resetPassword(body);
    }

    @ApiOperationPost({
        path: '/request-password-reset',
        parameters: { body: { required: true, model: "RequestPasswordResetRequest" } },
        responses: { 200: { model: "SuccessResponse" } }
    })
    @httpPost('/request-password-reset', makeValidateBody(RequestPasswordResetRequest))
    private async requestPasswordReset(
        @requestBody() body: RequestPasswordResetRequest
    ): Promise<SuccessResponse> {
        return await this.authService.requestPasswordReset(body);
    }

    @ApiOperationPost({
        path: '/change-password',
        parameters: { body: { required: true, model: "ChangePasswordRequest" } },
        responses: { 200: { model: "SuccessResponse" } },
        security: { 'Api-Key': [], 'Authorization': [] }
    })
    @httpPost('/reset-password', makeValidateBody(ChangePasswordRequest))
    private async changePassword(
        @request() req: any,
        @requestBody() body: ChangePasswordRequest
    ): Promise<SuccessResponse> {
        return await this.authService.changePassword(req.user, body);
    }

    @ApiOperationDelete({
        path: '/',
        parameters: {},
        responses: { 200: { model: "SuccessResponse" } },
        security: { 'Api-Key': [], 'Authorization': [] }
    })
    @httpDelete('/', checkIfUserActivated())
    private async delete(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        return await this.authService.deleteUser(req.user);
    }
}
