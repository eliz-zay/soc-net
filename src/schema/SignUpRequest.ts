import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import {
    IsAlphanumeric,
    IsEmail,
    IsString,
    MaxLength,
} from 'class-validator';

@ApiModel()
export class SignUpRequest {
    @IsEmail()
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    email: string;

    @IsAlphanumeric()
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    username: string;

    @IsString()
    @ApiModelProperty({ required: true })
    password: string;
}
