import express from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { interfaces, controller, httpGet, request } from 'inversify-express-utils';
import { inject } from 'inversify';

import { CommonService } from '../service';
import { GeoResponseSchema } from '../schema';
import { ErrorMessages } from '../messages';

@ApiPath({
    path: "/common",
    name: "Common",
})
@controller('/common')
export class CommonController implements interfaces.Controller {
    constructor(@inject("CommonService") private commonService: CommonService) { }

    @ApiOperationGet({
        path: '/countries',
        parameters: {},
        responses: { 200: { model: "GeoResponseSchema" } },
    })
    @httpGet('/countries')
    private async getCountries(): Promise<GeoResponseSchema> {
        const geoPresets = await this.commonService.getCountries();

        return {
            success: true,
            data: geoPresets
        };
    }

    @ApiOperationGet({
        path: '/regions',
        parameters: {
            query: {
                countryId: {
                    description: 'Country id',
                    required: false,
                    type: SwaggerDefinitionConstant.Response.Type.NUMBER,
                },
            }
        },
        responses: { 200: { model: "GeoResponseSchema" } },
    })
    @httpGet('/regions')
    private async getRegions(@request() req: express.Request): Promise<GeoResponseSchema> {
        const id = Number(req.query.countryId);

        if (!id || id <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const geoPresets = await this.commonService.getRegions(id);

        return {
            success: true,
            data: geoPresets
        };
    }

    @ApiOperationGet({
        path: '/cities',
        parameters: {
            query: {
                regionId: {
                    description: 'Region id',
                    required: false,
                    type: SwaggerDefinitionConstant.Response.Type.NUMBER,
                },
            }
        },
        responses: { 200: { model: "GeoResponseSchema" } },
    })
    @httpGet('/cities')
    private async getCities(@request() req: express.Request): Promise<GeoResponseSchema> {
        const id = Number(req.query.regionId);

        if (!id || id <= 0) {
            throw (ErrorMessages.ValidationFailed);
        }

        const geoPresets = await this.commonService.getCities(id);

        return {
            success: true,
            data: geoPresets
        };
    }
}
