import moment from 'moment';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { EHobby, EOccupation, EUserGender, User } from '../model';

@ApiModel()
export class UserInfoSchema {
    @ApiModelProperty({ required: true, enum: Object.values(EUserGender).filter((value) => typeof value === 'string') })
    gender: EUserGender;

    @ApiModelProperty({ required: true })
    birthday: string;

    @ApiModelProperty({ required: true })
    country: string;

    @ApiModelProperty({ required: true })
    region: string;

    @ApiModelProperty({ required: false })
    city?: string;

    @ApiModelProperty({ required: true })
    visibleForAdProposal: boolean;

    @ApiModelProperty({ required: false })
    businessDescription?: string;

    @ApiModelProperty({ required: true, enum: Object.values(EOccupation).filter((value) => typeof value === 'string') })
    occupation: EOccupation;

    @ApiModelProperty({ required: true, type: 'array', itemType: 'string', enum: Object.values(EHobby).filter((value) => typeof value === 'string') })
    hobbies: EHobby[];
}

@ApiModel()
export class UserInfoDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "UserInfoSchema", required: true })
    userInfo: UserInfoSchema;
}

@ApiModel()
export class UserInfoResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "UserInfoDataSchema", required: true })
    data: UserInfoDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToUserInfoSchema(user: User): UserInfoSchema {
    const {
        gender, birthday, country, region, city, businessDescription,
        occupation, hobbies, visibleForAdProposal
    } = user;

    return {
        gender: gender!,
        birthday: moment(birthday!).format('YYYY-MM-DD'),
        country: country!.name,
        region: region!.name,
        city: city?.name,
        businessDescription,
        occupation: occupation!,
        hobbies: hobbies!,
        visibleForAdProposal: visibleForAdProposal!
    };
}
