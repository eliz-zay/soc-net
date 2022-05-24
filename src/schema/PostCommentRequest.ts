import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsString, MaxLength } from 'class-validator';

@ApiModel()
export class PostCommentRequest {
    @MaxLength(200)
    @IsString()
    @ApiModelProperty({ required: false })
    content: string;
}
