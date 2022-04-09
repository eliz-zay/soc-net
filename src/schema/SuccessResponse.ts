import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel()
export class SuccessResponse {
    @ApiModelProperty({ required: true })
    success: true;
}
