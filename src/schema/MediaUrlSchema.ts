import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { EFileType } from '../core/files';

@ApiModel()
export class MediaUrlSchema {
    @ApiModelProperty({ required: true, type: 'string', enum: Object.values(EFileType).filter((value) => typeof value === 'string') })
    type: EFileType;

    @ApiModelProperty({ required: true })
    url: string;
}
