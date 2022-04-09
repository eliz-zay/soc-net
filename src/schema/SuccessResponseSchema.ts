import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel()
export class SuccessResponseSchema {
    @ApiModelProperty({ required: true })
    success: boolean;
}
