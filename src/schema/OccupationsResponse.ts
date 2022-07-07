import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

import { EOccupation } from "../model";

@ApiModel()
export class OccupationSchema {
    @ApiModelProperty({ required: true, enum: Object.values(EOccupation).filter((value) => typeof value === 'string') })
    code: string;

    @ApiModelProperty({ required: true })
    name: string;
}

@ApiModel()
export class OccupationsDataSchema {
    @ApiModelProperty({ required: true, type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'OccupationSchema' })
    occupations: OccupationSchema[];
}

@ApiModel()
export class OccupationsResponse {
    @ApiModelProperty({ required: true, model: 'OccupationsDataSchema' })
    data: OccupationsDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

const EOccupationTranslation = {
    [EOccupation.Student]: 'Студент',
    [EOccupation.Working]: 'Профессионал',
    [EOccupation.Blogger]: 'Блоггер',
    [EOccupation.Businessman]: 'Предприниматель',
    [EOccupation.Company]: 'Компания',
}

export function transformToOccupationSchema(code: EOccupation): OccupationSchema {
    const name = EOccupationTranslation[code];
    return { code, name }
}
