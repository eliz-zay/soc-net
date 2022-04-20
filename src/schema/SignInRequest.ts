import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import {
    IsEmail,
    IsString,
    MaxLength
} from 'class-validator';

@ApiModel()
export class SignInRequest {
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    emailOrUsername: string;

    @IsString()
    @ApiModelProperty({ required: true })
    password: string;
}
