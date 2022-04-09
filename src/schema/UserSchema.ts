import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { User } from '../model/';

@ApiModel()
export class UserSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    email: string;

    @ApiModelProperty({ required: true })
    isEmailVerified: boolean;
}

export function transformToUserSchema(user: User): UserSchema {
    const { id, email, isEmailVerified } = user;
    const schema = {
        id,
        email,
        isEmailVerified: !!isEmailVerified
    };

    return schema;
}
