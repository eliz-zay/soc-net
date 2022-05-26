import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { User, PostGroup, Post } from '../model';
import { GroupSchema, transformToGroupsSchema } from './GroupSchema';
import { PostSchema } from './PostSchema';

@ApiModel()
export class ProfileSchema {
    @ApiModelProperty({ required: true })
    name: string;

    @ApiModelProperty({ required: true })
    username: string;

    @ApiModelProperty({ required: true })
    basicDescription?: string;

    @ApiModelProperty({ required: true })
    photoUrl?: string;

    @ApiModelProperty({ required: true })
    followeesCount: number;

    @ApiModelProperty({ required: true })
    followersCount: number;
}

@ApiModel()
export class ProfileDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "ProfileSchema", required: true })
    profile: ProfileSchema;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "PostSchema", required: true })
    posts: PostSchema[];

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "PostSchema", required: true })
    groups: GroupSchema[];
}

@ApiModel()
export class ProfileResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "ProfileDataSchema", required: true })
    data: ProfileDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToProfileDataSchema(
    user: User & { followeesCount: number; followersCount: number },
    groups: PostGroup[],
    posts: (Post & { likesCount: number; })[]

): ProfileDataSchema {
    const { name, username, basicDescription, photoUrl, followeesCount, followersCount } = user;

    return {
        profile: {
            name: name!,
            username,
            basicDescription,
            photoUrl,
            followeesCount,
            followersCount
        },
        groups: groups.map((group) => transformToGroupsSchema(group)),
        posts: posts.map(({ id, content, mediaUrls, tags, likesCount, comments }) => ({
            id,
            content,
            mediaUrls,
            tags,
            likesCount,
            commentsCount: comments.length
        }))
    };
}
