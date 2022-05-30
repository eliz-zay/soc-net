import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

import { ETag, Tag } from "../model";

@ApiModel()
export class TagSchema {
    @ApiModelProperty({ required: true, enum: Object.values(ETag).filter((value) => typeof value === 'string') })
    code: string;

    @ApiModelProperty({ required: true })
    name: string;
}

@ApiModel()
export class TagsDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'TagSchema', required: true })
    tags: TagSchema[];
}

@ApiModel()
export class TagsResponse {
    @ApiModelProperty({ required: true, model: 'TagsDataSchema' })
    data: TagsDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToTagSchema(tag: Tag) {
    const { code, name } = tag;
    return { code, name };
}
