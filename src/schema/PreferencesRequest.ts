import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { EGroupViewType, ETag, EOccupation } from '../model';

@ApiModel()
export class PreferencesRequest {
    @IsBoolean()
    @ApiModelProperty({ required: true })
    visibleForAdProposal: boolean;

    @IsBoolean()
    @ApiModelProperty({ required: true })
    wantsToUseBusinessProfile: boolean;

    @IsOptional()
    @IsString()
    @ApiModelProperty({ required: false })
    businessDescription?: string;

    @IsEnum(EOccupation)
    @ApiModelProperty({ required: true, enum: Object.values(EOccupation).filter((value) => typeof value === 'string') })
    occupation: EOccupation;

    @IsEnum(ETag, { each: true })
    @ArrayMaxSize(3)
    @ArrayMinSize(3)
    @ApiModelProperty({ required: true, type: 'array', itemType: 'string', enum: Object.values(ETag).filter((value) => typeof value === 'string') })
    hobbies: ETag[];

    @IsEnum(EGroupViewType)
    @ApiModelProperty({ required: true, enum: Object.values(EGroupViewType).filter((value) => typeof value === 'string') })
    profileViewType: EGroupViewType;
}
