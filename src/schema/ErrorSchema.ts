import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel()
export class ErrorSchema {
    @ApiModelProperty()
    title: string;

    @ApiModelProperty({ required: true })
    message: string;

    @ApiModelProperty()
    code: number;

    constructor(partial: Partial<ErrorSchema>) {
        Object.assign(this, partial);
    }
}
