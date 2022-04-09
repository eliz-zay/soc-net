import express from 'express';

import { ErrorMessages } from './';

export function apiTokenMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    return req.header('Api-Token') !== process.env.API_TOKEN ? next(ErrorMessages.IncorrectApiToken) : next();
}
