import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsEnum, IsInt, IsOptional, Min, ArrayMaxSize, IsString, MinLength, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

import { EOccupation, ETag } from '../model';

@ApiModel()
export class FilterSearchRequest {
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

    @ApiModelProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;

    @ApiModelProperty({ required: false, enum: Object.values(EOccupation).filter((value) => typeof value === 'string') })
    @IsOptional()
    @IsEnum(EOccupation)
    occupation?: EOccupation;

    @ApiModelProperty({ required: false })
    @IsOptional()
    @Transform((value) => Number(value?.value), { toClassOnly: true })
    @IsInt()
    @Min(0)
    countryId?: number;

    @ApiModelProperty({ required: false, type: 'array', itemType: 'string', enum: Object.values(ETag).filter((value) => typeof value === 'string') })
    @IsOptional()
    @Transform((value) => value?.value ? value.value.split(',') : [], { toClassOnly: true })
    @IsEnum(ETag, { each: true })
    hobbieCodes?: ETag[];
}
