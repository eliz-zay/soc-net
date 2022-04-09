import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel()
export class ErrorSchema {
    httpCode: number = 400;

    @ApiModelProperty()
    title: string;

    @ApiModelProperty({ required: true })
    message: string;

    @ApiModelProperty()
    code: number;

    constructor(partial: Partial<ErrorSchema>) {
        Object.assign(this, partial);
    }

    preview(): Partial<ErrorSchema> {
        return { title: this.title, message: this.message, code: this.code }
    }
}
