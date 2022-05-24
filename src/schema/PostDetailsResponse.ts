import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { Post, User } from '../model';

import { PostCommentSchema, transformToPostCommentSchema } from './PostCommentSchema';
import { PostSchema, transformToPostSchema } from '.';
import { ProfileSummarySchema, transformToProfileSummarySchema } from './ProfileSummarySchema';

@ApiModel()
export class PostDetailsDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "PostSchema", required: true })
    post: PostSchema;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "ProfileSummarySchema", required: true })
    author: ProfileSummarySchema;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "ProfileSummarySchema", required: true })
    likes: ProfileSummarySchema[];

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "PostCommentSchema", required: true })
    comments: PostCommentSchema[];
}

@ApiModel()
export class PostDetailsResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "PostDetailsDataSchema", required: true })
    data: PostDetailsDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToPostDetailsDataSchema(post: Post, commentedUsers: User[]): PostDetailsDataSchema {
    const postSchema = transformToPostSchema(post);
    const authorSchema = transformToProfileSummarySchema(post.user);
    const likesSchema = post.likes.map((likedUser) => transformToProfileSummarySchema(likedUser));

    const grouppedCommentedUsers: { [id: number]: User } = {};
    commentedUsers.forEach((user) => grouppedCommentedUsers[user.id] = user);

    const commentsSchema = post.comments.map((comment) => transformToPostCommentSchema(comment, grouppedCommentedUsers[comment.userId]));

    return {
        post: postSchema,
        author: authorSchema,
        likes: likesSchema,
        comments: commentsSchema
    }
}
