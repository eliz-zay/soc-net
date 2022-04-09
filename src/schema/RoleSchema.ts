import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel()
export class RoleSchema {
    @ApiModelProperty({ required: true })
    role: string;
}
