import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { UserSchema } from '.';

@ApiModel()
export class UserResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "LoggedInUserSchema", required: true })
    data: UserSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}
