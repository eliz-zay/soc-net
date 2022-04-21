import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EGroupViewType, } from '../model';

@ApiModel()
export class AddGroupRequest {
    @IsString()
    @ApiModelProperty({ required: false })
    name: string;

    @IsOptional()
    @IsString()
    @ApiModelProperty({ required: false })
    firstGroupNewName: string;

    @IsEnum(EGroupViewType)
    @ApiModelProperty({ required: true, enum: Object.values(EGroupViewType).filter((value) => typeof value === 'string') })
    groupViewType: EGroupViewType;
}
