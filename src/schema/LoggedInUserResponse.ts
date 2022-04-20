import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { UserSchema } from '.';

@ApiModel()
export class LoggedInUserSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "UserSchema", required: true })
    user: UserSchema;

    @ApiModelProperty({ required: true })
    token: string;
}

@ApiModel()
export class LoggedInUserResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "LoggedInUserSchema", required: true })
    data: LoggedInUserSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToLoggedInUserSchema(user: UserSchema, token: string): LoggedInUserSchema {
    return {
        user,
        token
    };
}
