"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
const schema_1 = require("../schema");
exports.ErrorMessages = Object.freeze({
    UserWithGivenEmailExists: new schema_1.ErrorSchema({
        title: 'Пользлватель с такой почтой уже существует',
        message: 'Пользлватель с такой почтой уже существует',
        code: 1
    }),
    IncorrectApiToken: new schema_1.ErrorSchema({
        title: 'Некорректный токен АПИ',
        message: 'Некорректный токен АПИ',
        code: 2
    }),
    AuthorizationRequired: new schema_1.ErrorSchema({
        title: 'Требуется авторизация',
        message: 'Требуется авторизация',
        code: 3
    }),
    UserWithGivenEmailDoesntExist: new schema_1.ErrorSchema({
        title: 'Пользователь с данным email не существует',
        message: 'Пользователь с данным email не существует',
        code: 4
    }),
    PasswordNotValid: new schema_1.ErrorSchema({
        title: 'Пароль некорректен',
        message: 'Пароль некорректен',
        code: 5
    }),
    OtpCodeNotValid: new schema_1.ErrorSchema({
        title: 'Верификационный код некорректен',
        message: 'Верификационный код некорректен',
        code: 6
    }),
    OtpCodeExpired: new schema_1.ErrorSchema({
        title: 'Верификационный код устарел',
        message: 'Верификационный код устарел',
        code: 7
    }),
    EmailAlreadyVerified: new schema_1.ErrorSchema({
        title: 'Вы уже подтвержили адрес почты',
        message: 'Вы уже подтвержили адрес почты',
        code: 8
    }),
    CantResetPasswordForUnverifiedAccount: new schema_1.ErrorSchema({
        title: 'Восстановление пароля дляя неподтвержденного аккаунта невозможно',
        message: 'Восстановление пароля дляя неподтвержденного аккаунта невозможно',
        code: 9
    }),
    ValidationFailed: new schema_1.ErrorSchema({
        title: 'Ошибка валидации',
        message: 'Ошибка валидации',
        code: 10
    }),
    NotAllowedForUnverifiedUsers: new schema_1.ErrorSchema({
        title: 'Это действие недопустимо для пользователей, не подтвердивших свой адрес электронной почты',
        message: 'Это действие недопустимо для пользователей, не подтвердивших свой адрес электронной почты',
        code: 11
    }),
    InternalError: new schema_1.ErrorSchema({
        title: 'Внутренняя ошибка, пожалуйста попробуйте позже',
        message: 'Внутренняя ошибка, пожалуйста попробуйте позже',
        code: 12
    }),
    InvalidToken: new schema_1.ErrorSchema({
        title: 'Некорректный или истекший токен',
        message: 'Некорректный или истекший токен',
        code: 13
    }),
    UserWithGivenIdDoesntExist: new schema_1.ErrorSchema({
        title: 'Пользователь с данным ID не существует',
        message: 'Пользователь с данным ID не существует',
        code: 4
    }),
    RoleAlreadyAdded: new schema_1.ErrorSchema({
        title: 'Пользователь уже имеет данную роль',
        message: 'Пользователь уже имеет данную роль',
        code: 4
    })
});
