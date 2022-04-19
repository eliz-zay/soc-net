import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsInt } from 'class-validator';

@ApiModel()
export class VerifyEmailRequest {
    @IsInt()
    @ApiModelProperty({ required: true })
    otpCode: number;
}
