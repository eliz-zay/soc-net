import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { EUserGender } from '../model';

@ApiModel()
export class PersonalInfoRequest {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @ApiModelProperty({ required: true })
    name: string;

    @IsEnum(EUserGender)
    @ApiModelProperty({ required: true, enum: Object.values(EUserGender).filter((value) => typeof value === 'string') })
    gender: EUserGender;

    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/im, { message: 'date must have format YYYY-MM-DD' })
    @ApiModelProperty({ required: true })
    birthday: string;

    @IsInt()
    @Min(1)
    @ApiModelProperty({ required: true })
    countryId: number;

    @IsInt()
    @Min(1)
    @ApiModelProperty({ required: true })
    regionId: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiModelProperty({ required: false })
    cityId?: number;

    @IsOptional()
    @Matches(/^[a-zA-Z0-9_]{5,32}$/g, { message: 'telegram username must have length [5, 32] and can contain A-z, 0-9 and underscores' })
    @ApiModelProperty({ required: false })
    telegram?: string;
}
