import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { Notification } from '../model';

@ApiModel()
export class NotificationSchema {
    @ApiModelProperty({ required: true })
    id: number;

    @ApiModelProperty({ required: true })
    title: string;

    @ApiModelProperty({ required: true })
    text: string;

    @ApiModelProperty({ required: true })
    type: string;

    @ApiModelProperty({ required: true })
    isRead: boolean;

    @ApiModelProperty({ required: true })
    createdAt: Date;
}

@ApiModel()
export class NotificationsDataSchema {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.ARRAY, model: 'NotificationSchema', required: true })
    notifications: NotificationSchema[];

    @ApiModelProperty({ required: true })
    total: number;
}

@ApiModel()
export class NotificationsDataResponse {
    @ApiModelProperty({ itemType: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'NotificationsDataSchema', required: true })
    data: NotificationsDataSchema;

    @ApiModelProperty({ required: true })
    success: boolean;
}

export function transformToNotificationSchema(notification: Notification): NotificationSchema {
    const { id, title, text, notificationCode, readAt, createdAt } = notification;
    const schema = {
        id,
        title,
        text,
        type: notificationCode,
        isRead: !!readAt,
        createdAt,
    };

    return schema;
}

export function transformToNotificationsDataSchema(notificationsRaw: Notification[], total: number): NotificationsDataSchema {
    const notifications = notificationsRaw.map((notification) => transformToNotificationSchema(notification));

    return { notifications, total };
}
