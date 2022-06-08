import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { EFileType } from '../core/files';

@ApiModel()
export class MyFeedRequest {
    @ApiModelProperty({ required: false })
    @IsOptional()
    @Transform((value) => value?.value ? Number(value.value) : 1, { toClassOnly: true })
    @IsInt()
    @Min(0)
    page: number = 1;

    @ApiModelProperty({ required: false })
    @IsOptional()
    @Transform((value) => value?.value ? Number(value.value) : 10, { toClassOnly: true })
    @IsInt()
    @Min(0)
    count: number = 10;

    @ApiModelProperty({ required: false, type: 'array', itemType: 'string', enum: Object.values(EFileType).filter((value) => typeof value === 'string') })
    @Transform((value) => value?.value ? value.value.split(',') : [], { toClassOnly: true })
    @IsEnum(EFileType, { each: true })
    @IsOptional()
    mediaType?: EFileType[];
}
