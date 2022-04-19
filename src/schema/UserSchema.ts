import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { EProfileFillingStage, User } from '../model/';

@ApiModel()
export class UserSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    email: string;

    @ApiModelProperty({ required: true })
    isEmailVerified: boolean;

    @ApiModelProperty({ required: true, enum: Object.values(EProfileFillingStage).filter((value) => typeof value === 'string') })
    profileFillingStage: EProfileFillingStage;
}

export function transformToUserSchema(user: User): UserSchema {
    const { id, email, emailVerifiedAt, profileFillingStage } = user;
    const schema = {
        id,
        email,
        isEmailVerified: !!emailVerifiedAt,
        profileFillingStage
    };

    return schema;
}
