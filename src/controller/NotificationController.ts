import express from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, request, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { NotificationService } from '../service';
import { PaginationRequest } from '../schema';
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
    private async getNotifications(@request() req: express.Request & { user: JwtPayload }) {
        const paginationRequest: PaginationRequest = await transformAndValidate(PaginationRequest, req.query);
        const notificationsData = await this.notificationService.get(req.user, paginationRequest);

        return { success: true, data: notificationsData };
    }
}
