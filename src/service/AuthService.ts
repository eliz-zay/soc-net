import { inject, injectable } from "inversify";
import moment from 'moment';
import { getRepository, IsNull, Repository } from "typeorm";

import { User, OtpCode, EMailType } from '../model';
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
import { HashedData, JwtPayload, encode, hashString, signJwt, validateHash } from '../core';
import { ErrorMessages } from '../messages';
import { LoggerService, Mail, MailService } from '.';

@injectable()
export class AuthService {
    private userRepository: Repository<User>;

    constructor(
        @inject("MailService") private mailService: MailService,
        @inject('LoggerService') private logger: LoggerService
    ) {
        this.userRepository = getRepository(User);
    }

    public async signUp(signUpRequest: SignUpRequest): Promise<LoggedInUserSchema> {
        const { email, password } = signUpRequest;

        const usersByEmail = await this.userRepository.find({ email });
        if (usersByEmail.length !== 0) {
            throw ErrorMessages.UserWithGivenEmailExists;
        }

        const hashedData: HashedData = await hashString(password);
        const otpCode = this.generateOtp();

        const user = new User(signUpRequest);

        user.salt = hashedData.salt;
        user.passHash = hashedData.hash;
        user.referralString = encode(email);
        user.otpCodes = [otpCode];

        const insertedUser = await this.userRepository.save(user);

        const mail: Mail = {
            destinationAddresses: [user.email],
            type: EMailType.VerifyAccount,
            data: { code: otpCode.code }
        };

        try {
            await this.mailService.sendMail(mail);
        } catch (error) {
            this.logger.warn(`Email sending failed for user ${user.email}`);
        }

        const jwtToken: string = await this.generateJwt(insertedUser);

        const mappedUser = transformToUserSchema(user);
        return transformToLoggedInUserSchema(mappedUser, jwtToken);
    }

    public async requestEmailVerification(jwtPayload: JwtPayload): Promise<SuccessResponse> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const user = await this.userRepository.findOne({ id: jwtPayload.id, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }
        if (user.emailVerifiedAt) {
            throw ErrorMessages.EmailAlreadyVerified;
        }

        const otpCode: OtpCode = this.generateOtp();

        const mail: Mail = {
            destinationAddresses: [user.email],
            type: EMailType.VerifyAccount,
            data: { code: otpCode.code }
        };

        await this.mailService.sendMail(mail);

        await this.userRepository.update(user.id, { otpCodes: [...user.otpCodes, otpCode] });

        return { success: true };
    }

    public async verifyEmail(jwtPayload: JwtPayload, verifyEmailRequest: VerifyEmailRequest): Promise<SuccessResponse> {
        if (!jwtPayload) {
            throw ErrorMessages.AuthorizationRequired;
        }

        const { id, email } = jwtPayload;
        const { otpCode } = verifyEmailRequest;

        await this.checkOtpCode({ email, otpCode });

        await this.userRepository.update({ id }, { emailVerifiedAt: moment.utc().toDate() });

        return { success: true };
    }

    public async getUserInfo(jwtPayload: JwtPayload): Promise<UserSchema> {
        const { id } = jwtPayload;

        const user = await this.userRepository.findOne({ id, deletedAt: IsNull() });
        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        return transformToUserSchema(user);
    }

    public async signIn(signInRequest: SignInRequest): Promise<LoggedInUserSchema> {
        const { emailOrUsername, password } = signInRequest;

        const user = emailOrUsername.includes('@')
            ? await this.userRepository.findOne({ email: emailOrUsername, deletedAt: IsNull() })
            : await this.userRepository.findOne({ username: emailOrUsername, deletedAt: IsNull() });

        if (!user) {
            throw ErrorMessages.EmailOrUsernameIncorrect;
        }

        const isPassportValid = await validateHash(password, user.salt, user.passHash);
        if (!isPassportValid) {
            throw ErrorMessages.PasswordNotValid;
        }

        const jwtToken: string = await this.generateJwt(user);

        const mappedUser = transformToUserSchema(user);
        return transformToLoggedInUserSchema(mappedUser, jwtToken);
    }

    public async checkOtpCode(checkOtpCodeRequest: CheckOtpCodeRequest): Promise<SuccessResponse> {
        const { otpCode, email } = checkOtpCodeRequest;

        const user = await this.userRepository.findOne({ email, deletedAt: IsNull() });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const neededCodes = user.otpCodes.filter((mOtpCode) => mOtpCode.code === otpCode);

        if (neededCodes.length === 0) {
            throw ErrorMessages.OtpCodeNotValid;
        }

        const activeOtpCodes = neededCodes.filter((mOtpCode) => moment().isBefore(mOtpCode.expirationDate));
        if (activeOtpCodes.length === 0) {
            throw ErrorMessages.OtpCodeExpired;
        }

        return { success: true };
    }

    public async requestPasswordReset(requestPasswordResetRequest: RequestPasswordResetRequest): Promise<SuccessResponse> {
        const { email } = requestPasswordResetRequest;

        const user = await this.userRepository.findOne({ email, deletedAt: IsNull() });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        if (!user.emailVerifiedAt) {
            throw ErrorMessages.CantResetPasswordForUnverifiedAccount;
        }

        const otpCode: OtpCode = this.generateOtp();

        const mail: Mail = {
            destinationAddresses: [user.email],
            type: EMailType.VerifyPasswordReset,
            data: { code: otpCode.code }
        };

        await this.mailService.sendMail(mail);

        await this.userRepository.update(user.id, { otpCodes: [...user.otpCodes, otpCode] });

        return { success: true };
    }

    public async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<SuccessResponse> {
        const { otpCode, email, password } = resetPasswordRequest;

        await this.checkOtpCode({ email, otpCode });

        const user = await this.userRepository.findOne({ email, deletedAt: IsNull() });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const { salt, hash } = await hashString(password);

        await this.userRepository.update(user.id, { salt, passHash: hash });

        return { success: true };
    }

    public async changePassword(jwtPayload: JwtPayload, changePasswordRequest: ChangePasswordRequest): Promise<SuccessResponse> {
        const { currentPassword, newPassword } = changePasswordRequest;

        const user = await this.userRepository.findOne({ email: jwtPayload.email, deletedAt: IsNull() });
        if (!user) {
            throw ErrorMessages.UserWithGivenEmailDoesntExist;
        }

        const { salt, passHash } = user;

        const isPassportValid = await validateHash(currentPassword, salt, passHash);
        if (!isPassportValid) {
            throw ErrorMessages.PasswordNotValid;
        }

        const { salt: newSalt, hash: newHash } = await hashString(newPassword);

        await this.userRepository.update(user.id, { salt: newSalt, passHash: newHash });

        return { success: true };
    }

    public async deleteUser(jwtPayload: JwtPayload): Promise<SuccessResponse> {
        const { id } = jwtPayload;

        const user = await this.userRepository.findOne({ id, deletedAt: IsNull() });
        if (!user) {
            throw ErrorMessages.UserWithGivenIdDoesntExist;
        }

        await this.userRepository.update(user.id, { deletedAt: moment.utc().toDate() });

        return {
            success: true
        };
    }

    private async generateJwt(user: User): Promise<string> {
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email
        };

        const jwtToken: string = await signJwt(jwtPayload, process.env.JWT_SECRET ?? 'secret');

        return jwtToken;
    }

    private generateOtp(): OtpCode {
        const code = Math.floor(1000 + Math.random() * 9000);
        const expirationDate = moment.utc().add(process.env.OTP_EXPIRES_MINUTES, 'minutes').toDate();

        return {
            code,
            generationDate: moment.utc().toDate(),
            expirationDate
        };
    }
}
