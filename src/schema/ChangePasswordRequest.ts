import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsString } from 'class-validator';

@ApiModel()
export class ChangePasswordRequest {
    @IsString()
    @ApiModelProperty({ required: true })
    currentPassword: string;

    @IsString()
    @ApiModelProperty({ required: true })
    newPassword: string;
}
