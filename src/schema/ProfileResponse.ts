import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { User, PostGroup, Post, EOccupation } from '../model';
import { GroupSchema, PostSchema, transformToGroupsSchema } from '.';

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

    @ApiModelProperty({ required: true, enum: Object.values(EOccupation).filter((value) => typeof value === 'string') })
    occupation: EOccupation;

    @ApiModelProperty({ required: true })
    country: string;
    
    @ApiModelProperty({ required: true })
    region: string;

    @ApiModelProperty({ required: false })
    telegram?: string;
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
    const {
        name, username, basicDescription, photoUrl, followeesCount, followersCount,
        occupation, country, region, telegram
    } = user;

    return {
        profile: {
            name: name!,
            username,
            basicDescription,
            photoUrl,
            followeesCount,
            followersCount,
            occupation: occupation!,
            country: country!.name,
            region: region!.name,
            telegram
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
