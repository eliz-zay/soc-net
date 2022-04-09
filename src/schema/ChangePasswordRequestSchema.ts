import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsString } from 'class-validator';

@ApiModel()
export class ChangePasswordRequestSchema {
    @IsString()
    @ApiModelProperty({ required: true })
    currentPassword: string;

    @IsString()
    @ApiModelProperty({ required: true })
    newPassword: string;
}
