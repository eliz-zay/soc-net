import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

@ApiModel()
export class VerifyEmailRequestSchema {
    @IsInt()
    @Transform((value) => Number(value))
    @ApiModelProperty({ required: true })
    otpCode: number;
}
