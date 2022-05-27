import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { EFileType } from '../core/files';
import { ETag, Post } from '../model';

@ApiModel()
export class PostSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    content: string;

    @ApiModelProperty({ required: false })
    groupName?: string;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "MediaUrlSchema", required: true })
    mediaUrls: MediaUrlSchema[];

    @ApiModelProperty({ required: true, type: 'array', itemType: 'string', enum: Object.values(ETag).filter((value) => typeof value === 'string') })
    tags: ETag[];

    @ApiModelProperty({ required: true })
    likesCount: number;

    @ApiModelProperty({ required: true })
    commentsCount: number;
}

@ApiModel()
export class MediaUrlSchema {
    @ApiModelProperty({ required: true, type: 'string', enum: Object.values(EFileType).filter((value) => typeof value === 'string') })
    type: EFileType;

    @ApiModelProperty({ required: true })
    url: string;
}

export function transformToPostSchema(post: Post): PostSchema {
    const { id, content, comments, likesCount, postGroup, mediaUrls, tags } = post;

    return {
        id,
        content,
        groupName: postGroup?.name,
        mediaUrls,
        tags,
        likesCount,
        commentsCount: comments.length
    };
}
