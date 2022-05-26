import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Comment, User } from '../model';

@ApiModel()
export class PostCommentSchema {
    @ApiModelProperty({ required: true })
    content: string;

    @ApiModelProperty({ required: true })
    name: string;

    @ApiModelProperty({ required: true })
    username: string;

    @ApiModelProperty({ required: true })
    profilePhotoUrl: string | undefined;
}

export function transformToPostCommentSchema(comment: Comment, user: User): PostCommentSchema {
    const { content } = comment;
    const { name, username, photoUrl } = user;

    return {
        name,
        username,
        content,
        profilePhotoUrl: photoUrl
    };
}
