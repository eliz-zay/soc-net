import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { PostGroup } from '../model';
import { GroupSchema, PostSchema, transformToGroupsSchema, transformToPostSchema } from '.';

export class GroupAndPostsDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'GroupSchema', required: true })
    group: GroupSchema;

    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, type: 'array', model: 'PostSchema', required: true })
    posts: PostSchema[];
}

@ApiModel()
export class GroupAndPostsResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'GroupAndPostsDataSchema', required: true })
    data: GroupAndPostsDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToGroupAndPostsDataSchema(postGroup: PostGroup): GroupAndPostsDataSchema {
    const group = transformToGroupsSchema(postGroup);
    const posts = postGroup.posts.map((post) => transformToPostSchema(post));

    return { group, posts };
}
