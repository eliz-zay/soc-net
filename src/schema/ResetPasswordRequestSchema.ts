import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsString, IsInt, IsEmail, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

@ApiModel()
export class ResetPasswordRequestSchema {
    @IsEmail()
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    email: string;

    @IsInt()
    @Transform((value) => Number(value))
    @ApiModelProperty({ required: true })
    otpCode: number;

    @IsString()
    @ApiModelProperty({ required: true })
    password: string;
}
