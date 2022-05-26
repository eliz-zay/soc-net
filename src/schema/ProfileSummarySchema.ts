import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { User } from '../model';

@ApiModel()
export class ProfileSummarySchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    name: string;

    @ApiModelProperty({ required: true })
    username: string;

    @ApiModelProperty({ required: true })
    profilePhotoUrl: string | undefined;
}

export function transformToProfileSummarySchema(user: User): ProfileSummarySchema {
    const { id, name, username, photoUrl } = user;

    return {
        id,
        name: name!,
        username,
        profilePhotoUrl: photoUrl
    };
}
