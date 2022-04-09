import express from 'express';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { interfaces, controller, httpPost, requestBody, request, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { makeValidateBody } from 'express-class-validator';

import { AuthService } from './../service/';
import {
    SignUpRequestSchema,
    SignInRequestSchema,
    VerifyEmailRequestSchema,
    SuccessResponseSchema,
    RequestPasswordResetRequestSchema,
    ResetPasswordRequestSchema,
    LoggedInUserResponse,
    UserResponse,
    ChangePasswordRequestSchema
} from './../schema/';
import { JwtPayload } from '../interface';

@ApiPath({
    path: "",
    name: "Auth",
    security: { 'Api-Token': [] }
})
@controller('')
export class AuthController implements interfaces.Controller {
    constructor(@inject("AuthService") private authService: AuthService) { }

    @ApiOperationPost({
        path: '/sign-up',
        parameters: { body: { required: true, model: "SignUpRequestSchema" } },
        responses: { 200: { model: "LoggedInUserResponse" } }
    })
    @httpPost('/sign-up', makeValidateBody(SignUpRequestSchema))
    private async signUp(@requestBody() signUpRequestSchema: SignUpRequestSchema): Promise<LoggedInUserResponse> {
        const loggedInUser = await this.authService.signUp(signUpRequestSchema);

        return {
            payload: loggedInUser,
            success: true
        };
    }

    @ApiOperationPost({
        path: '/sign-in',
        parameters: { body: { required: true, model: "SignInRequestSchema" } },
        responses: { 200: { model: "LoggedInUserResponse" } }
    })
    @httpPost('/sign-in', makeValidateBody(SignInRequestSchema))
    private async signIn(@requestBody() signInRequestSchema: SignInRequestSchema): Promise<LoggedInUserResponse> {
        const loggedInUser = await this.authService.signIn(signInRequestSchema);

        return {
            payload: loggedInUser,
            success: true
        };
    }

    @ApiOperationGet({
        path: '/user-info',
        responses: { 200: { model: "UserResponse" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    })
    @httpGet('/user-info')
    private async userInfo(@request() req: express.Request & { user: JwtPayload }): Promise<UserResponse> {
        const loggedInUser = await this.authService.getUserInfo(req.user);

        return {
            payload: loggedInUser,
            success: true
        };
    }

    @ApiOperationGet({
        path: '/request-email-verification',
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    })
    @httpGet('/request-email-verification')
    private async requestEmailVerification(@request() req: any): Promise<SuccessResponseSchema> {
        return await this.authService.requestEmailVerification(req.user);
    }

    @ApiOperationPost({
        path: '/verify-email',
        parameters: { body: { required: true, model: "VerifyEmailRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    })
    @httpPost('/verify-email', makeValidateBody(VerifyEmailRequestSchema))
    private async verifyEmail(
        @request() req: any,
        @requestBody() verifyEmailRequestSchema: VerifyEmailRequestSchema
    ): Promise<SuccessResponseSchema> {
        return await this.authService.verifyEmail(req.user, verifyEmailRequestSchema);
    }

    @ApiOperationPost({
        path: '/reset-password',
        parameters: { body: { required: true, model: "ResetPasswordRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } }
    })
    @httpPost('/reset-password', makeValidateBody(ResetPasswordRequestSchema))
    private async resetPassword(
        @requestBody() resetPasswordRequestSchema: ResetPasswordRequestSchema
    ): Promise<SuccessResponseSchema> {
        return await this.authService.resetPassword(resetPasswordRequestSchema);
    }

    @ApiOperationPost({
        path: '/request-password-reset',
        parameters: { body: { required: true, model: "RequestPasswordResetRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } }
    })
    @httpPost('/request-password-reset', makeValidateBody(RequestPasswordResetRequestSchema))
    private async requestPasswordReset(
        @requestBody() requestPasswordResetRequestSchema: RequestPasswordResetRequestSchema
    ): Promise<SuccessResponseSchema> {
        return await this.authService.requestPasswordReset(requestPasswordResetRequestSchema);
    }

    @ApiOperationPost({
        path: '/change-password',
        parameters: { body: { required: true, model: "ChangePasswordRequestSchema" } },
        responses: { 200: { model: "SuccessResponseSchema" } },
        security: { 'Api-Token': [], 'Authorization': [] }
    })
    @httpPost('/reset-password', makeValidateBody(ChangePasswordRequestSchema))
    private async changePassword(
        @request() req: any,
        @requestBody() changePasswordRequestSchema: ChangePasswordRequestSchema
    ): Promise<SuccessResponseSchema> {
        return await this.authService.changePassword(req.user, changePasswordRequestSchema);
    }

    @ApiOperationDelete({
        path: '/delete',
        parameters: {},
        responses: { 200: { model: "SuccessResponseSchema" } }
    })
    @httpPost('/delete')
    private async delete(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponseSchema> {
        return await this.authService.deleteUser(req.user);
    }
}
