import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsEmail, MaxLength } from 'class-validator';

@ApiModel()
export class RequestPasswordResetRequest {
    @IsEmail()
    @MaxLength(40)
    @ApiModelProperty({ required: true })
    email: string;
}
