import { inject, injectable } from 'inversify';
import { getRepository, In, IsNull, Repository } from 'typeorm';
import moment from 'moment';

import { Notification, User } from '../model';
import { JwtPayload } from '../core';
import { ErrorMessages } from '../messages';
import { LoggerService } from '.';
import {
    PaginationRequest,
    NotificationsDataSchema,
    MarkReadNotificationsRequest,
    transformToNotificationsDataSchema,
} from '../schema/';

@injectable()
export class NotificationService {
    private userRepository: Repository<User>;
    private notificationRepository: Repository<Notification>;

    constructor(@inject('LoggerService') private logger: LoggerService) {
        this.userRepository = getRepository(User);
        this.notificationRepository = getRepository(Notification);
    }

    public async get(jwtPayload: JwtPayload, payload: PaginationRequest): Promise<NotificationsDataSchema> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        const whereClause = { userId: jwtPayload.id, deletedAt: IsNull() };

        const [notifications, totalNotificationsNumber] = await Promise.all([
            this.notificationRepository.find({
                where: whereClause,
                skip: (payload.page - 1) * payload.count,
                take: payload.count,
                order: { id: 'ASC' },
            }),
            this.notificationRepository.count({
                where: whereClause,
            })
        ]);

        return transformToNotificationsDataSchema(notifications, totalNotificationsNumber);
    }

    public async markRead(jwtPayload: JwtPayload, payload: MarkReadNotificationsRequest) {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        this.notificationRepository.update(
            {
                id: In(payload.ids),
                readAt: IsNull(),
            },
            {
                readAt: moment.utc()
            }
        );
    }
}
