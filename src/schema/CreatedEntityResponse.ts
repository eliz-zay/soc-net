import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

@ApiModel()
export class CreatedEntitySchema {
    @ApiModelProperty({ required: true })
    id: number;
}

@ApiModel()
export class CreatedEntityResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "CreatedEntitySchema", required: true })
    data: CreatedEntitySchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}
