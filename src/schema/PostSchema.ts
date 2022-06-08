import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { TagSchema, MediaUrlSchema } from '.';
import { Post } from '../model';

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

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "TagSchema", required: true })
    tags: TagSchema[];

    @ApiModelProperty({ required: true })
    likesCount: number;

    @ApiModelProperty({ required: true })
    commentsCount: number;
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
