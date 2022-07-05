import express from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, request, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { FeedService } from '../service';
import { MyFeedRequest, FeedResponse, PaginationRequest } from '../schema';
import { JwtPayload, transformAndValidate } from '../core';

@ApiPath({
    path: "/feed",
    name: "Feed",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/feed')
export class FeedController implements interfaces.Controller {
    constructor(@inject('FeedService') private feedService: FeedService) { }

    @ApiOperationGet({
        path: '/my',
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
                mediaTypes: {
                    description: 'Media types',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.ARRAY
                }
            }
        },
        responses: { 200: { model: 'FeedResponse' } },
    })
    @httpGet('/my')
    private async getMyFeed(@request() req: express.Request & { user: JwtPayload }): Promise<FeedResponse> {
        const feedRequest: MyFeedRequest = await transformAndValidate(MyFeedRequest, req.query);
        const data = await this.feedService.getMyFeed(req.user, feedRequest);

        return { success: true, data };
    }

    @ApiOperationGet({
        path: '/recommendations',
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
                }
            }
        },
        responses: { 200: { model: 'FeedResponse' } },
    })
    @httpGet('/recommendations')
    private async getRecommendations(@request() req: express.Request & { user: JwtPayload }): Promise<FeedResponse> {
        const feedRequest: PaginationRequest = await transformAndValidate(PaginationRequest, req.query);
        const data = await this.feedService.getRecommendations(req.user, feedRequest);

        return { success: true, data };
    }

    @ApiOperationGet({
        path: '/popular',
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
                }
            }
        },
        responses: { 200: { model: 'FeedResponse' } },
    })
    @httpGet('/popular')
    private async getPopular(@request() req: express.Request): Promise<FeedResponse> {
        const feedRequest: PaginationRequest = await transformAndValidate(PaginationRequest, req.query);
        const data = await this.feedService.getPopular(feedRequest);

        return { success: true, data };
    }
}
