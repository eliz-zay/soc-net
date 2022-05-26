import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsNumber } from 'class-validator';

@ApiModel()
export class MarkReadNotificationsRequest {
    @ApiModelProperty({ required: true, type: 'array', itemType: 'integer' })
    @IsNumber({},{ each: true })
    ids: number[];
}
