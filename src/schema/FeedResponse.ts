import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { PostAndAuthorSchema } from '.';

@ApiModel()
export class FeedDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "PostAndAuthorSchema", required: true })
    posts: PostAndAuthorSchema[];
}

@ApiModel()
export class FeedResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "FeedDataSchema", required: true })
    data: FeedDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}
