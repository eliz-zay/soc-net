import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { LoggedInUserSchema } from '.';

@ApiModel()
export class LoggedInUserResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "LoggedInUserSchema", required: true })
    payload: LoggedInUserSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}
