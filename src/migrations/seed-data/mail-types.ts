import { EMailType, MailType } from "../../model";

export const mailTypeSeeds = [
    new MailType({
        code: EMailType.VerifyAccount,
        titleTemplate: 'socnet: Подтвердите свой аккаунт',
        textTemplate: 'Ваш код подтверждения - {code}'
    }),
    new MailType({
        code: EMailType.VerifyChangeEmail,
        titleTemplate: 'socnet: Вы запросили смену почты',
        textTemplate: 'В качестве подтверждения смены почты введите код - {code}'
    }),
    new MailType({
        code: EMailType.VerifyPasswordReset,
        titleTemplate: 'socnet: Вы запросили сброс пароля',
        textTemplate: 'Ваш код подтверждения для сброса пароля - {code}'
    })
];
