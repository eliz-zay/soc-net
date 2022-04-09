"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const winston_1 = __importDefault(require("winston"));
const typeorm_1 = require("typeorm");
const model_1 = require("./../model/");
const schema_1 = require("./../schema/");
const helper_1 = require("./../helper");
const _1 = require(".");
let AuthService = class AuthService {
    constructor(mailService, logger) {
        this.mailService = mailService;
        this.logger = logger;
        this.userRepository = typeorm_1.getRepository(model_1.User);
        this.credentialsRepository = typeorm_1.getRepository(model_1.Credentials);
        this.otpCodeRepository = typeorm_1.getRepository(model_1.OtpCode);
    }
    signUp(signUpRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = signUpRequestSchema;
            const usersByEmail = yield this.userRepository.find({ email });
            if (usersByEmail.length !== 0) {
                throw helper_1.ErrorMessages.UserWithGivenEmailExists;
            }
            const encodedPassword = this.encodePassword(password);
            const credentials = new model_1.Credentials(encodedPassword);
            const insertedCredentials = yield this.credentialsRepository.save(credentials);
            const user = new model_1.User(signUpRequestSchema);
            user.credentials = insertedCredentials;
            const insertedUser = yield this.userRepository.save(user);
            insertedUser.roles = [];
            const otpStructure = this.generateOtp();
            const mail = {
                destinationAddresses: [user.email],
                sourseAddress: String(process.env.MAIL_SENDER),
                subject: helper_1.EmailSubjects.VerifyEmail,
                text: String(otpStructure.code),
                senderName: String(process.env.MAIL_SENDER_NAME)
            };
            try {
                yield this.mailService.sendMail(mail);
            }
            catch (error) {
                this.logger.warn(`Email sending failed for user ${user.email}`);
            }
            const otpCode = new model_1.OtpCode(otpStructure);
            otpCode.user = new model_1.User({ id: insertedUser.id });
            yield this.otpCodeRepository.save(otpCode);
            const jwtToken = this.generateJwt(insertedUser);
            const mappedUser = schema_1.transformToUserSchema(user);
            return schema_1.transformToLoggedInUserSchema(mappedUser, jwtToken);
        });
    }
    requestEmailVerification(jwtPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jwtPayload) {
                throw helper_1.ErrorMessages.AuthorizationRequired;
            }
            const user = yield this.userRepository.findOne({ id: jwtPayload.id, isDeleted: false });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            if (user.isEmailVerified) {
                throw helper_1.ErrorMessages.EmailAlreadyVerified;
            }
            const otpStructure = this.generateOtp();
            const mail = {
                destinationAddresses: [user.email],
                sourseAddress: String(process.env.MAIL_SENDER),
                subject: helper_1.EmailSubjects.VerifyEmail,
                text: String(otpStructure.code),
                senderName: String(process.env.MAIL_SENDER_NAME)
            };
            yield this.mailService.sendMail(mail);
            const otpCode = new model_1.OtpCode(otpStructure);
            otpCode.user = new model_1.User({ id: user.id });
            yield this.otpCodeRepository.save(otpCode);
            return { success: true };
        });
    }
    verifyEmail(jwtPayload, verifyEmailRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jwtPayload) {
                throw helper_1.ErrorMessages.AuthorizationRequired;
            }
            const { id, email } = jwtPayload;
            const { otpCode } = verifyEmailRequestSchema;
            yield this.checkOtpCode({ email, otpCode });
            yield this.userRepository.update({ id }, { isEmailVerified: true });
            return { success: true };
        });
    }
    getUserInfo(jwtPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = jwtPayload;
            const user = yield this.userRepository.findOne({ id, isDeleted: false }, { relations: ['credentials', 'roles'] });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            return schema_1.transformToUserSchema(user);
        });
    }
    signIn(signInRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = signInRequestSchema;
            const user = yield this.userRepository.findOne({ email, isDeleted: false }, { relations: ['credentials', 'roles'] });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            const { salt, hash } = user.credentials;
            const isPassportValid = this.validatePassword(password, salt, hash);
            if (!isPassportValid) {
                throw helper_1.ErrorMessages.PasswordNotValid;
            }
            const jwtToken = this.generateJwt(user);
            const mappedUser = schema_1.transformToUserSchema(user);
            return schema_1.transformToLoggedInUserSchema(mappedUser, jwtToken);
        });
    }
    checkOtpCode(checkOtpCodeRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otpCode, email } = checkOtpCodeRequestSchema;
            const user = yield this.userRepository.findOne({ email, isDeleted: false });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            const otpCodes = yield this.otpCodeRepository.find({ code: otpCode, user: { id: user.id } });
            if (otpCodes.length === 0) {
                throw helper_1.ErrorMessages.OtpCodeNotValid;
            }
            const activeOtpCodes = otpCodes.filter((otpCodesItem) => moment_1.default().isBefore(otpCodesItem.expirationDate));
            if (activeOtpCodes.length === 0) {
                throw helper_1.ErrorMessages.OtpCodeExpired;
            }
            return { success: true };
        });
    }
    requestPasswordReset(requestPasswordResetRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = requestPasswordResetRequestSchema;
            const user = yield this.userRepository.findOne({ email, isDeleted: false });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            if (!user.isEmailVerified) {
                throw helper_1.ErrorMessages.CantResetPasswordForUnverifiedAccount;
            }
            const otpStructure = this.generateOtp();
            const mail = {
                destinationAddresses: [user.email],
                sourseAddress: String(process.env.MAIL_SENDER),
                subject: helper_1.EmailSubjects.PasswordReset,
                text: String(otpStructure.code),
                senderName: String(process.env.MAIL_SENDER_NAME)
            };
            yield this.mailService.sendMail(mail);
            const otpCode = new model_1.OtpCode(otpStructure);
            otpCode.user = new model_1.User({ id: user.id });
            yield this.otpCodeRepository.save(otpCode);
            return { success: true };
        });
    }
    resetPassword(resetPasswordRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otpCode, email, password } = resetPasswordRequestSchema;
            yield this.checkOtpCode({ email, otpCode });
            const user = yield this.userRepository.findOne({ email, isDeleted: false }, { relations: ['credentials'] });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            const { salt, hash } = this.encodePassword(password);
            yield this.credentialsRepository.update(user.credentials.id, { salt, hash });
            return { success: true };
        });
    }
    changePassword(jwtPayload, changePasswordRequestSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPassword, newPassword } = changePasswordRequestSchema;
            const user = yield this.userRepository.findOne({ email: jwtPayload.email, isDeleted: false }, { relations: ['credentials'] });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            const { salt, hash } = user.credentials;
            const isPassportValid = this.validatePassword(currentPassword, salt, hash);
            if (!isPassportValid) {
                throw helper_1.ErrorMessages.PasswordNotValid;
            }
            const { salt: newSalt, hash: newHash } = this.encodePassword(newPassword);
            yield this.credentialsRepository.update(user.credentials.id, { salt: newSalt, hash: newHash });
            return { success: true };
        });
    }
    deleteUser(jwtPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = jwtPayload;
            const user = yield this.userRepository.findOne({ id, isDeleted: false });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenEmailDoesntExist;
            }
            yield this.userRepository.update(user.id, { isDeleted: true });
            return {
                success: true
            };
        });
    }
    addRole(userId, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ id: userId, isDeleted: false }, { relations: ['credentials', 'roles'] });
            if (!user) {
                throw helper_1.ErrorMessages.UserWithGivenIdDoesntExist;
            }
            const roles = user.roles.map((role) => role.id);
            if (roles.includes(newRole)) {
                throw helper_1.ErrorMessages.RoleAlreadyAdded;
            }
            roles.push(newRole);
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .relation(model_1.User, "roles")
                .of(user)
                .add({ id: newRole });
            return {
                success: true
            };
        });
    }
    encodePassword(password) {
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        const hash = crypto_1.default.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return { salt, hash };
    }
    validatePassword(password, salt, hash) {
        const incomingHash = crypto_1.default.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return hash === incomingHash;
    }
    generateJwt(user) {
        var _a;
        const jwtPayload = {
            id: user.id,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            roles: user.roles.map((role) => role.id)
        };
        const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'secret');
        return jwtToken;
    }
    generateOtp() {
        const code = Math.floor(1000 + Math.random() * 9000);
        const expirationDate = new Date(new Date().getTime() + Number(process.env.OTP_EXPIRES_MINUTES) * 60 * 1000);
        return {
            code,
            expirationDate
        };
    }
};
AuthService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject("MailService")),
    __param(1, inversify_1.inject('Logger')),
    __metadata("design:paramtypes", [_1.MailService, Object])
], AuthService);
exports.AuthService = AuthService;
