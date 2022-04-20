import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsBoolean } from 'class-validator';

@ApiModel()
export class UserInfoPatchRequest {
    @IsBoolean()
    @ApiModelProperty({ required: true })
    visibleForAdProposal: boolean;
}
