import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { EHobby, EOccupation } from '../model';

@ApiModel()
export class PreferencesRequest {
    @IsBoolean()
    @ApiModelProperty({ required: true })
    visibleForAdProposal: boolean;

    @IsOptional()
    @IsString()
    @ApiModelProperty({ required: false })
    businessDescription: string;

    @IsEnum(EOccupation)
    @ApiModelProperty({ required: true, enum: Object.values(EOccupation).filter((value) => typeof value === 'string') })
    occupation: EOccupation;

    @IsEnum(EHobby, { each: true })
    @ArrayMaxSize(3)
    @ArrayMinSize(3)
    @ApiModelProperty({ required: true, type: 'array', itemType: 'string', enum: Object.values(EHobby).filter((value) => typeof value === 'string') })
    hobbies: EHobby[];
}
