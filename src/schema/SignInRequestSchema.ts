import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import {
    IsEmail,
    IsString,
    MaxLength
} from 'class-validator';

@ApiModel()
export class SignInRequestSchema {
    @IsEmail()
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    email: string;

    @IsString()
    @ApiModelProperty({ required: true })
    password: string;
}
