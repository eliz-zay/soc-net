import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

@ApiModel()
export class AddPostRequest {
    @MaxLength(10000)
    @IsString()
    @ApiModelProperty({ required: false })
    content: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiModelProperty({ required: false })
    groupId: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiModelProperty({ required: false })
    dealId: number;
}
