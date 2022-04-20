import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsEnum, IsInt, IsOptional, Matches } from 'class-validator';
import { EUserGender } from '../model';

@ApiModel()
export class PersonalInfoRequest {
    @IsEnum(EUserGender)
    @ApiModelProperty({ required: true, enum: Object.values(EUserGender).filter((value) => typeof value === 'string') })
    gender: EUserGender;

    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/im, { message: 'date must have format YYYY-MM-DD' })
    @ApiModelProperty({ required: true })
    birthday: string;

    @IsInt()
    @ApiModelProperty({ required: true })
    countryId: number;

    @IsInt()
    @ApiModelProperty({ required: true })
    regionId: number;

    @IsOptional()
    @IsInt()
    @ApiModelProperty({ required: false })
    cityId?: number;
}
