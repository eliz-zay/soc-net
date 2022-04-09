import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { User } from '../model/';

@ApiModel()
export class UserSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    email: string;

    @ApiModelProperty({
        required: true,
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        itemType: SwaggerDefinitionConstant.Response.Type.STRING
    })
    roles: string[];

    @ApiModelProperty({ required: true })
    isEmailVerified: boolean;
}

export function transformToUserSchema(user: User): UserSchema {
    const { id, email, roles, isEmailVerified } = user;
    const schema = {
        id,
        email,
        roles: roles.map((role) => role.name),
        isEmailVerified: !!isEmailVerified
    };

    return schema;
}
