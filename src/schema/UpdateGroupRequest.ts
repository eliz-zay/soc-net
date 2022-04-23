import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EGroupViewType, } from '../model';

@ApiModel()
export class UpdateGroupRequest {
    @IsOptional()
    @IsString()
    @ApiModelProperty({ required: false })
    name: string;

    @IsOptional()
    @IsEnum(EGroupViewType)
    @ApiModelProperty({ required: true, enum: Object.values(EGroupViewType).filter((value) => typeof value === 'string') })
    viewType: EGroupViewType;
}
