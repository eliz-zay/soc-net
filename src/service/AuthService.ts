import { inject, injectable } from "inversify";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import winston from "winston";
import { getRepository, Repository } from "typeorm";

import { User, Credentials, OtpCode } from '../model';
import {
    SignUpRequest,
    transformToLoggedInUserSchema,
    SignInRequest,
    LoggedInUserSchema,
    VerifyEmailRequest,
    SuccessResponse,
    RequestPasswordResetRequest,
    ResetPasswordRequest,
    CheckOtpCodeRequest,
    transformToUserSchema,
    UserSchema,
    ChangePasswordRequest
} from '../schema/';
import { EncodedData, JwtPayload, Mail, OtpStructure } from '../interface/';
import { EmailSubjects, ErrorMessages } from '../messages';
import { LoggerService, MailService } from '.';

@injectable()
export class AuthService {
    private userRepository: Repository<User>;
    private credentialsRepository: Repository<Credentials>;
    private otpCodeRepository: Repository<OtpCode>;

    constructor(
        @inject("MailService") private mailService: MailService,
        @inject('LoggerService') private logger: LoggerService
    ) {
        this.userRepository = getRepository(User);
        this.credentialsRepository = getRepository(Credentials);
        this.otpCodeRepository = getRepository(OtpCode);
    }

    public async signUp(SignUpRequest: SignUpRequest): Promise<LoggedInUserSchema> {
        const { email, password } = SignUpRequest;

        const usersByEmail = await this.userRepository.find({ email });
        if (usersByEmail.length !== 0) {
            throw ErrorMessages.UserWithGivenEmailExists;
        }

        const encodedPassword: EncodedData = this.encodePassword(password);

        const credentials = new Credentials(encodedPassword);
        const insertedCredentials = await this.credentialsRepository.save(credentials);

        const user = new User(SignUpRequest);

        user.credentials = insertedCredentials;

        const insertedUser = await this.userRepository.save(user);

        const otpStructure = this.generateOtp();

        const mail: Mail = {
            destinationAddresses: [user.email],
            sourseAddress: String(process.env.MAIL_SENDER),
            subject: EmailSubjects.VerifyEmail,
            text: String(otpStructure.code),
            senderName: String(process.env.MAIL_SENDER_NAME)
        };

        try {
            await this.mailService.sendMail(mail);
        } catch (error) {
            this.logger.warn(`Email sending failed for user ${user.email}`);
        }

        const otpCode = new OtpCode(otpStructure);
        otpCode.user = new User({ id: insertedUser.id });
        await this.otpCodeRepository.save(otpCode);

        const jwtToken: string = this.generateJwt(insertedUser);

        const mappedUser = transformToUserSchema(user);
        return transformToLoggedInUserSchema(mappedUser, jwtToken);
    }

    public async requestEmailVerification(jwtPayload: JwtPayload): Promise<SuccessResponse> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, isDeleted: false });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }
        if (user.isEmailVerified) {
            throw ErrorMessages.EmailAlreadyVerified;
        }

        const otpStructure = this.generateOtp();

        const mail: Mail = {
            destinationAddresses: [user.email],
            sourseAddress: String(process.env.MAIL_SENDER),
            subject: EmailSubjects.VerifyEmail,
            text: String(otpStructure.code),
            senderName: String(process.env.MAIL_SENDER_NAME)
        };
        await this.mailService.sendMail(mail);

        const otpCode = new OtpCode(otpStructure);
        otpCode.user = new User({ id: user.id });
        await this.otpCodeRepository.save(otpCode);

        return { success: true };
    }

    public async verifyEmail(jwtPayload: JwtPayload, VerifyEmailRequest: VerifyEmailRequest): Promise<SuccessResponse> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const { id, email } = jwtPayload;
        const { otpCode } = VerifyEmailRequest;

        await this.checkOtpCode({ email, otpCode });

        await this.userRepository.update({ id }, { isEmailVerified: true });

        return { success: true };
    }

    public async getUserInfo(jwtPayload: JwtPayload): Promise<UserSchema> {
        const { id } = jwtPayload;

        const user = await this.userRepository.findOne({ id, isDeleted: false }, { relations: ['credentials', 'roles'] });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        return transformToUserSchema(user);
    }

    public async signIn(SignInRequest: SignInRequest): Promise<LoggedInUserSchema> {
        const { email, password } = SignInRequest;

        const user = await this.userRepository.findOne({ email, isDeleted: false }, { relations: ['credentials', 'roles'] });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const { salt, hash } = user.credentials;

        const isPassportValid = this.validatePassword(password, salt, hash);
        if (!isPassportValid) {
            throw ErrorMessages.PasswordNotValid;
        }

        const jwtToken: string = this.generateJwt(user);

        const mappedUser = transformToUserSchema(user);
        return transformToLoggedInUserSchema(mappedUser, jwtToken);
    }

    public async checkOtpCode(CheckOtpCodeRequest: CheckOtpCodeRequest): Promise<SuccessResponse> {
        const { otpCode, email } = CheckOtpCodeRequest;

        const user = await this.userRepository.findOne({ email, isDeleted: false });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const otpCodes = await this.otpCodeRepository.find({ code: otpCode, user: { id: user.id } });
        if (otpCodes.length === 0) {
            throw ErrorMessages.OtpCodeNotValid;
        }

        const activeOtpCodes = otpCodes.filter((otpCodesItem) => moment().isBefore(otpCodesItem.expirationDate));
        if (activeOtpCodes.length === 0) {
            throw ErrorMessages.OtpCodeExpired;
        }

        return { success: true };
    }

    public async requestPasswordReset(RequestPasswordResetRequest: RequestPasswordResetRequest): Promise<SuccessResponse> {
        const { email } = RequestPasswordResetRequest;

        const user = await this.userRepository.findOne({ email, isDeleted: false });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        if (!user.isEmailVerified) {
            throw ErrorMessages.CantResetPasswordForUnverifiedAccount;
        }

        const otpStructure = this.generateOtp();

        const mail: Mail = {
            destinationAddresses: [user.email],
            sourseAddress: String(process.env.MAIL_SENDER),
            subject: EmailSubjects.PasswordReset,
            text: String(otpStructure.code),
            senderName: String(process.env.MAIL_SENDER_NAME)
        };
        await this.mailService.sendMail(mail);

        const otpCode = new OtpCode(otpStructure);
        otpCode.user = new User({ id: user.id });
        await this.otpCodeRepository.save(otpCode);

        return { success: true };
    }

    public async resetPassword(ResetPasswordRequest: ResetPasswordRequest): Promise<SuccessResponse> {
        const { otpCode, email, password } = ResetPasswordRequest;

        await this.checkOtpCode({ email, otpCode });

        const user = await this.userRepository.findOne({ email, isDeleted: false }, { relations: ['credentials'] });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const { salt, hash } = this.encodePassword(password);

        await this.credentialsRepository.update(user.credentials.id, { salt, hash });

        return { success: true };
    }

    public async changePassword(jwtPayload: JwtPayload, ChangePasswordRequest: ChangePasswordRequest): Promise<SuccessResponse> {
        const { currentPassword, newPassword } = ChangePasswordRequest;

        const user = await this.userRepository.findOne({ email: jwtPayload.email, isDeleted: false }, { relations: ['credentials'] });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const { salt, hash } = user.credentials;

        const isPassportValid = this.validatePassword(currentPassword, salt, hash);
        if (!isPassportValid) {
            throw ErrorMessages.PasswordNotValid;
        }

        const { salt: newSalt, hash: newHash } = this.encodePassword(newPassword);

        await this.credentialsRepository.update(user.credentials.id, { salt: newSalt, hash: newHash });

        return { success: true };
    }

    public async deleteUser(jwtPayload: JwtPayload): Promise<SuccessResponse> {
        const { id } = jwtPayload;

        const user = await this.userRepository.findOne({ id, isDeleted: false });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        await this.userRepository.update(user.id, { isDeleted: true });

        return {
            success: true
        };
    }

    private encodePassword(password: string): EncodedData {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

        return { salt, hash };
    }

    private validatePassword(password: string, salt: string, hash: string): boolean {
        const incomingHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        return hash === incomingHash;
    }

    private generateJwt(user: User): string {
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
        };

        const jwtToken: string = jwt.sign(jwtPayload, process.env.JWT_SECRET ?? 'secret');

        return jwtToken;
    }

    private generateOtp(): OtpStructure {
        const code = Math.floor(1000 + Math.random() * 9000);
        const expirationDate = new Date(new Date().getTime() + Number(process.env.OTP_EXPIRES_MINUTES) * 60 * 1000);

        return {
            code,
            expirationDate
        };
    }
}
