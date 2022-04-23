import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { GroupSchema } from '.';

@ApiModel()
export class GroupsDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, type: 'array', model: "GroupSchema", required: true })
    groups: GroupSchema[];
}

@ApiModel()
export class GroupsResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "GroupsDataSchema", required: true })
    data: GroupsDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}
