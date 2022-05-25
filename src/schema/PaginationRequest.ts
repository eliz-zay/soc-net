import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

@ApiModel()
export class PaginationRequest {
    @ApiModelProperty({ required: false })
    @IsOptional()
    @Transform((value) => value?.value ? Number(value.value) : 1, { toClassOnly: true })
    @IsInt()
    @Min(0)
    page: number = 1;

    @ApiModelProperty({ required: false })
    @IsOptional()
    @Transform((value) => value?.value ? Number(value.value) : 10, { toClassOnly: true })
    @IsInt()
    @Min(0)
    count: number = 10;
}
