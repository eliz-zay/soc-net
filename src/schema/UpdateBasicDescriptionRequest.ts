import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsString, MaxLength } from 'class-validator';

@ApiModel()
export class UpdateBasicDescriptionRequest {
    @MaxLength(200)
    @IsString()
    @ApiModelProperty({ required: false })
    basicDescription: string;
}
