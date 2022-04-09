import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsInt, IsEmail, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

@ApiModel()
export class CheckOtpCodeRequest {
    @IsEmail()
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    email: string;

    @IsInt()
    @Transform((value) => Number(value))
    @ApiModelProperty({ required: true })
    otpCode: number;
}
