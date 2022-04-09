import { ErrorSchema } from "../schema";

export const ErrorMessages = Object.freeze({
    InternalError: new ErrorSchema({
        title: 'Внутренняя ошибка, пожалуйста попробуйте позже',
        message: 'Внутренняя ошибка, пожалуйста попробуйте позже',
        code: 1,
        httpCode: 500
    }),
    UserWithGivenEmailExists: new ErrorSchema({
        title: 'Пользлватель с такой почтой уже существует',
        message: 'Пользлватель с такой почтой уже существует',
        code: 2
    }),
    IncorrectApiKey: new ErrorSchema({
        title: 'Некорректный ключ АПИ',
        message: 'Некорректный ключ АПИ',
        code: 3
    }),
    AuthorizationRequired: new ErrorSchema({
        title: 'Требуется авторизация',
        message: 'Требуется авторизация',
        code: 4,
        httpCode: 401
    }),
    UserWithGivenEmailDoesntExist: new ErrorSchema({
        title: 'Пользователь с данным email не существует',
        message: 'Пользователь с данным email не существует',
        code: 5
    }),
    PasswordNotValid: new ErrorSchema({
        title: 'Пароль некорректен',
        message: 'Пароль некорректен',
        code: 6
    }),
    OtpCodeNotValid: new ErrorSchema({
        title: 'Верификационный код некорректен',
        message: 'Верификационный код некорректен',
        code: 7
    }),
    OtpCodeExpired: new ErrorSchema({
        title: 'Верификационный код устарел',
        message: 'Верификационный код устарел',
        code: 8
    }),
    EmailAlreadyVerified: new ErrorSchema({
        title: 'Вы уже подтвержили адрес почты',
        message: 'Вы уже подтвержили адрес почты',
        code: 9
    }),
    CantResetPasswordForUnverifiedAccount: new ErrorSchema({
        title: 'Восстановление пароля дляя неподтвержденного аккаунта невозможно',
        message: 'Восстановление пароля дляя неподтвержденного аккаунта невозможно',
        code: 10
    }),
    ValidationFailed: new ErrorSchema({
        title: 'Ошибка валидации',
        message: 'Ошибка валидации',
        code: 11
    }),
    NotAllowedForUnverifiedUsers: new ErrorSchema({
        title: 'Это действие недопустимо для пользователей, не подтвердивших свой адрес электронной почты',
        message: 'Это действие недопустимо для пользователей, не подтвердивших свой адрес электронной почты',
        code: 12
    }),
    InvalidToken: new ErrorSchema({
        title: 'Некорректный или истекший токен',
        message: 'Некорректный или истекший токен',
        code: 13,
        httpCode: 401
    }),
    UserWithGivenIdDoesntExist: new ErrorSchema({
        title: 'Пользователь с данным ID не существует',
        message: 'Пользователь с данным ID не существует',
        code: 14
    }),
    RoleAlreadyAdded: new ErrorSchema({
        title: 'Пользователь уже имеет данную роль',
        message: 'Пользователь уже имеет данную роль',
        code: 15
    })
});
