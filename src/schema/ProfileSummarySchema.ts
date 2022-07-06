import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

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

@ApiModel()
export class ProfileSummariesDataSchema {
    @ApiModelProperty({ required: true, itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'ProfileSummarySchema' })
    profiles: ProfileSummarySchema[];
}

@ApiModel()
export class ProfileSummariesResponse {
    @ApiModelProperty({ required: true, itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ProfileSummarySchema' })
    data: ProfileSummariesDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
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
