import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { ArrayMaxSize, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ETag } from '../model';

@ApiModel()
export class UpdatePostRequest {
    @IsOptional()
    @MaxLength(10000)
    @IsString()
    @ApiModelProperty({ required: false })
    content?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiModelProperty({ required: false })
    groupId?: number;

    @IsOptional()
    @IsEnum(ETag, { each: true })
    @ArrayMaxSize(3)
    @ApiModelProperty({ required: true, type: 'array', itemType: 'string', enum: Object.values(ETag).filter((value) => typeof value === 'string') })
    tags?: ETag[];
}
