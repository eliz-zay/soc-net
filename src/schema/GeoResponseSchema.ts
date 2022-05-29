import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { EGeoRange, Geo } from '../model';

@ApiModel()
export class GeoSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true, enum: Object.values(EGeoRange).filter((value) => typeof value === 'string') })
    range: EGeoRange;

    @ApiModelProperty({ required: true })
    name: string;
}

@ApiModel()
export class GeoDataSchema {
    @ApiModelProperty({ required: true, model: 'GeoSchema' })
    geoList: GeoSchema[];
}

@ApiModel()
export class GeoResponseSchema {
    @ApiModelProperty({ required: true })
    success: true;

    @ApiModelProperty({ required: true, model: 'GeoDataSchema' })
    data: GeoDataSchema;
}

export function transformToGeoSchema(geo: Geo): GeoSchema {
    const { id, name, range } = geo;

    return {
        id, range, name
    };
}
