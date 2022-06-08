import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { TagSchema } from '.';
import { MediaUrlSchema } from './MediaUrlSchema';
import { EFileType } from '../core/files';
import { Post, User } from '../model';

@ApiModel()
export class PostAndAuthorSchema {
    @ApiModelProperty({ required: true })
    authorId: number;

    @ApiModelProperty({ required: true })
    authorName: string;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "MediaUrlSchema", required: false })
    authorPhotoUrl?: MediaUrlSchema;

    @ApiModelProperty({ required: true })
    postId: number;

    @ApiModelProperty({ required: true })
    content: string;

    @ApiModelProperty({ required: false })
    groupName?: string;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "MediaUrlSchema", required: false })
    groupPreviewUrl?: MediaUrlSchema;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "MediaUrlSchema", required: true })
    mediaUrls: MediaUrlSchema[];

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "TagSchema", required: true })
    tags: TagSchema[];

    @ApiModelProperty({ required: true })
    likesCount: number;

    @ApiModelProperty({ required: true })
    commentsCount: number;

    @ApiModelProperty({ required: true })
    createdAt: Date;
}

export function transformToPostAndAuthorSchema(post: Post, user: User): PostAndAuthorSchema {
    const { id: authorId, name: authorName, photoUrl } = user;
    const { id: postId, content, postGroup, mediaUrls, tags, likesCount, comments, createdAt } = post;

    const authorPhotoUrl = photoUrl ? { url: photoUrl, type: EFileType.Image } : undefined;
    const groupPreviewUrl = postGroup?.previewUrl ? { url: postGroup.previewUrl, type: EFileType.Image } : undefined;

    return {
        authorId,
        authorName: authorName!,
        authorPhotoUrl,
        postId,
        content,
        groupName: postGroup?.name,
        groupPreviewUrl,
        mediaUrls,
        tags,
        likesCount,
        commentsCount: comments.length,
        createdAt
    };
}
