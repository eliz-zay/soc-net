import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { UserSchema } from './UserSchema';

@ApiModel()
export class LoggedInUserSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "UserSchema", required: true })
    user: UserSchema;

    @ApiModelProperty({ required: true })
    token: string;
}

export function transformToLoggedInUserSchema(user: UserSchema, token: string): LoggedInUserSchema {
    return {
        user,
        token
    };
}
