import express from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, request, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { SearchService } from '../service';
import { PaginationRequest, ProfileSummariesResponse } from '../schema';
import { JwtPayload, transformAndValidate } from '../core';

@ApiPath({
    path: "/search",
    name: "Search",
    security: { 'Api-Key': [], 'Authorization': [] }
})
@controller('/search')
export class SearchController implements interfaces.Controller {
    constructor(@inject('SearchService') private searchService: SearchService) { }

    @httpGet('/popular')
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
        responses: { 200: { model: 'ProfileSummariesResponse' } },
    })
    public async getPopular(@request() req: express.Request): Promise<ProfileSummariesResponse> {
        const paginationRequest: PaginationRequest = await transformAndValidate(PaginationRequest, req.query);
        const data = await this.searchService.getPopular(paginationRequest);

        return { success: true, data };
    }
}
