import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { EGroupViewType, PostGroup } from '../model/';

@ApiModel()
export class GroupSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    name: string;

    @ApiModelProperty({ required: false })
    previewUrl?: string;

    @ApiModelProperty({ required: true, enum: Object.values(EGroupViewType).filter((value) => typeof value === 'string') })
    viewType: EGroupViewType;

    @ApiModelProperty({ required: true })
    isPrivate: boolean;
}

export function transformToGroupsSchema(user: PostGroup): GroupSchema {
    const { id, name, previewUrl, viewType, isPrivate } = user;
    const schema = { id, name, previewUrl, viewType, isPrivate };

    return schema;
}
