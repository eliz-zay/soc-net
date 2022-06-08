import express from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, request, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { FeedService } from '../service';
import { MyFeedRequest, RecommendationsFeedRequest, FeedResponse } from '../schema';
import { JwtPayload, transformAndValidate } from '../core';

@ApiPath({
    path: "/feed",
    name: "Feed",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/feed')
export class HomeController implements interfaces.Controller {
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
                mediaType: {
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
        const posts = await this.feedService.getMyFeed(req.user, feedRequest);

        return { success: true, data: { posts } };
    }
}
