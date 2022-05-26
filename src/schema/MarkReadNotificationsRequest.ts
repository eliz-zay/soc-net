import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

@ApiModel()
export class MarkReadNotificationsRequest {
    @ApiModelProperty({ required: true, type: 'array', itemType: 'integer' })
    @Transform((value) => value?.value ? value.value.split(',').map((e: Number) => Number(e)) : [], { toClassOnly: true })
    @IsInt({ each: true })
    ids: number[];
}
