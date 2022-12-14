import express from 'express';
import { ApiOperationGet, ApiOperationPatch, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, request, httpGet, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';

import { NotificationService } from '../service';
import { MarkReadNotificationsRequest, NotificationsDataResponse, PaginationRequest, SuccessResponse } from '../schema';
import { JwtPayload, transformAndValidate } from '../core';
import { checkIfUserActivated } from './middlewares';

@ApiPath({
    path: '/notifications',
    name: 'Notifications',
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/notifications', checkIfUserActivated())
export class NotificationController implements interfaces.Controller {
    constructor(@inject('NotificationService') private notificationService: NotificationService) { }

    @ApiOperationGet({
        path: '/',
        parameters: {
            query: {
                page: {
                    description: 'Page number',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1
                },
                count: {
                    description: 'Number of elements per page',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1,
                },
            }
        },
        responses: { 200: { model: 'NotificationsDataResponse' } }
    })
    @httpGet('/')
    private async getNotifications(@request() req: express.Request & { user: JwtPayload }): Promise<NotificationsDataResponse> {
        const paginationRequest: PaginationRequest = await transformAndValidate(PaginationRequest, req.query);
        const notificationsData = await this.notificationService.get(req.user, paginationRequest);

        return { success: true, data: notificationsData };
    }

    @ApiOperationPatch({
        path: '/mark-read',
        parameters: {
            query: {
                ids: {
                    description: 'Array of notification ids',
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
                },
            }
        },
        responses: { 200: { model: 'SuccessResponse' } }
    })
    @httpPatch('/mark-read')
    private async markRead(@request() req: express.Request & { user: JwtPayload }): Promise<SuccessResponse> {
        const markReadRequest: MarkReadNotificationsRequest = await transformAndValidate(MarkReadNotificationsRequest, req.query);
        await this.notificationService.markRead(req.user, markReadRequest);

        return { success: true };
    }
}
