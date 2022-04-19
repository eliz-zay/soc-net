import { ENotificationType, NotificationType } from "../../model";

export const notificationTypeSeeds = [
    new NotificationType({
        code: ENotificationType.DealDeclined,
        titleTemplate: '{name} отклонил вашу сделку.',
    }),
    new NotificationType({
        code: ENotificationType.DealDiscussion,
        titleTemplate: '{name} принял вашу сделку.',
        textTemplate: 'Обсудите сделку с блоггером, чтоб прийти к соглашению по условиям и стоимости.'
    }),
    new NotificationType({
        code: ENotificationType.DealWaitingPayment,
        titleTemplate: '{name} ожидает вашей оплаты по сделке.',
        textTemplate: 'Попросите платежные данные у {name} и отправьте ему сумму, о которой вы с ним договорились.'
    }),
    new NotificationType({
        code: ENotificationType.DealWaitingPost,
        titleTemplate: '{name} ожидает рекламного поста в вашем профиле.',
        textTemplate: 'Создайте пост в вашем профиле, в котором вы будете рекламировать продукт. Не забудьте привязать сделку к посту.'
    }),
    new NotificationType({
        code: ENotificationType.EmailVerified,
        titleTemplate: 'Ваш аккаунт был подтвержден!',
        textTemplate: 'Теперь вам доступны все функция нашей платформы.'
    }),
    new NotificationType({
        code: ENotificationType.FriendJoined,
        titleTemplate: 'Ваш друг {name} присоединился к нашей платформе по вашему приглашению!',
    }),
    new NotificationType({
        code: ENotificationType.NewComment,
        titleTemplate: '{name} оставил комментарий у вашего поста {title}',
    }),
    new NotificationType({
        code: ENotificationType.NewDeal,
        titleTemplate: '{name} предлагает вам сделку на рекламу его/ее продукта!',
        textTemplate: 'Перейдите в раздел сделок, выберите данную сделку и начните диалог с инициатором сделки'
    }),
    new NotificationType({
        code: ENotificationType.NewFollower,
        titleTemplate: 'У вас новый подписчик: {name}',
    }),
    new NotificationType({
        code: ENotificationType.NewLike,
        titleTemplate: '{name} понравился ваш пост {title}',
    }),
];
