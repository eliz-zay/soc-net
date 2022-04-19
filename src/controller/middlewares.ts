import express from 'express';

import { assert, getFromDiContainer, JwtPayload } from '../core';
import { ErrorMessages } from '../messages';
import { EProfileFillingStage } from '../model';
import { AuthService } from '../service';

export function checkIfUserActivated() {
    return async (req: express.Request & { user: JwtPayload }, res: express.Response, next: express.NextFunction) => {
        const authService = getFromDiContainer<AuthService>('AuthService');

        assert(!!authService, 'AuthService from DI container can\'t be null');

        const user = await authService.getUserInfo(req.user);

        if (!user.isEmailVerified || user.profileFillingStage !== EProfileFillingStage.Filled) {
            return next(ErrorMessages.YouMustVerifyAndFillYourAccount);
        }

        return next();
    };
}
