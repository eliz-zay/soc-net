import express from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, request, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { SearchService } from '../service';
import { PaginationRequest, ProfileSummariesResponse, FilterSearchRequest } from '../schema';
import { transformAndValidate } from '../core';

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

    @httpGet('/filter')
    @ApiOperationGet({
        path: '/filter',
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
                name: {
                    description: 'Substring of name or username',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                occupation: {
                    description: 'User\'s occupation',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                countryId: {
                    description: 'Country ID',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                    minimum: 1,
                },
                hobbieCodes: {
                    description: 'Hobbie codes',
                    required: false,
                    type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
                }
            }
        },
        responses: { 200: { model: 'ProfileSummariesResponse' } },
    })
    public async getFiltered(@request() req: express.Request): Promise<ProfileSummariesResponse> {
        const searchRequest: FilterSearchRequest = await transformAndValidate(FilterSearchRequest, req.query);
        const data = await this.searchService.getFiltered(searchRequest);

        return { success: true, data };
    }
}
