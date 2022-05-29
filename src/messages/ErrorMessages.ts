import { ErrorSchema } from "../schema";

export const ErrorMessages = Object.freeze({
    InternalError: new ErrorSchema({
        title: 'Внутренняя ошибка, пожалуйста попробуйте позже',
        message: 'Внутренняя ошибка, пожалуйста попробуйте позже',
        code: 1,
        httpCode: 500
    }),
    UserWithGivenEmailExists: new ErrorSchema({
        title: 'Пользователь с такой почтой уже существует',
        message: 'Пользователь с такой почтой уже существует',
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
    }),
    YouMustVerifyAndFillYourAccount: new ErrorSchema({
        title: 'Для этого действия требуется подтверждение и заполнение профиля',
        message: 'Для этого действия требуется подтверждение и заполнение профиля',
        code: 16
    }),
    EmailOrUsernameIncorrect: new ErrorSchema({
        title: 'Неверно введен email или логин',
        message: 'Неверно введен email или логин',
        code: 17
    }),
    UserAlreadyFilledPersonalInfo: new ErrorSchema({
        title: 'Пользователь уже заполнил персональную информацию',
        message: 'Пользователь уже заполнил персональную информацию',
        code: 18
    }),
    GeoWithGivenIdDoesntExist: new ErrorSchema({
        title: 'Геолокация с заданным ID не существует',
        message: 'Геолокация с заданным ID не существует',
        code: 19
    }),
    RegionFromWrongCountry: new ErrorSchema({
        title: 'Регион не относится к выбранной вами стране',
        message: 'Регион не относится к выбранной вами стране',
        code: 20
    }),
    CityFromWrongRegion: new ErrorSchema({
        title: 'Город не относится к выбранному вами региону',
        message: 'Город не относится к выбранному вами региону',
        code: 21
    }),
    GeoHasWroingRange: new ErrorSchema({
        title: 'Выбранная геолокация имеет неверный диапазон',
        message: 'Выбранная геолокация имеет неверный диапазон',
        code: 22
    }),
    UserAlreadyFilledPreferences: new ErrorSchema({
        title: 'Пользователь уже заполнил настройки',
        message: 'Пользователь уже заполнил настройки',
        code: 23
    }),
    GroupNamesCantBeEqual: new ErrorSchema({
        title: 'Имена групп не могут совпадать',
        message: 'Имена групп не могут совпадать',
        code: 24
    }),
    MaxGroupsCountReached: new ErrorSchema({
        title: 'Вы достигли максимального количества групп',
        message: 'Вы достигли максимального количества групп',
        code: 25
    }),
    UserWithGivenUsernameExists: new ErrorSchema({
        title: 'Пользователь с таким логином уже существует',
        message: 'Пользователь с таким логином уже существует',
        code: 26
    }),
    PostGroupDoesntExist: new ErrorSchema({
        title: 'Группы постов с таким ID не существует',
        message: 'Группы постов с таким ID не существует',
        code: 27
    }),
    UserDoesntOwnThisPostGroup: new ErrorSchema({
        title: 'У вас нет группы постов с таким ID',
        message: 'У вас нет группы постов с таким ID',
        code: 28
    }),
    DealDoesntExist: new ErrorSchema({
        title: 'У вас нет сделки с таким ID',
        message: 'У вас нет сделки с таким ID',
        code: 29
    }),
    PostDoesntExist: new ErrorSchema({
        title: 'У вас нет поста с таким ID',
        message: 'У вас нет поста с таким ID',
        code: 30
    }),
    YouAlreadyUploadedMediaToPost: new ErrorSchema({
        title: 'Вы уже добавили медиа к этому посту',
        message: 'Вы уже добавили медиа к этому посту',
        code: 31
    }),
    YouCantFollowYourself: new ErrorSchema({
        title: 'Вы не можете подписаться сами на себя',
        message: 'Вы не можете подписаться сами на себя',
        code: 32
    })
});
