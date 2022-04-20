import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { EProfileFillingStage, User } from '../model/';

@ApiModel()
export class UserSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    username: string;

    @ApiModelProperty({ required: true })
    email: string;

    @ApiModelProperty({ required: true })
    isEmailVerified: boolean;

    @ApiModelProperty({ required: true, enum: Object.values(EProfileFillingStage).filter((value) => typeof value === 'string') })
    profileFillingStage: EProfileFillingStage;

    @ApiModelProperty({ required: true })
    photoUrl?: string;
}

export function transformToUserSchema(user: User): UserSchema {
    const { id, username, email, emailVerifiedAt, profileFillingStage, photoUrl } = user;
    const schema = {
        id,
        username,
        email,
        isEmailVerified: !!emailVerifiedAt,
        profileFillingStage,
        photoUrl
    };

    return schema;
}
