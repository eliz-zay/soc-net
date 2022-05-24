import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsEnum, IsString } from 'class-validator';
import { EGroupViewType, } from '../model';

@ApiModel()
export class AddGroupRequest {
    @IsString()
    @ApiModelProperty({ required: false })
    name: string;

    @IsEnum(EGroupViewType)
    @ApiModelProperty({ required: true, enum: Object.values(EGroupViewType).filter((value) => typeof value === 'string') })
    viewType: EGroupViewType;
}
