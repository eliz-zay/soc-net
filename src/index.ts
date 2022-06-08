import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import jwt from 'express-jwt';
import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as swagger from "swagger-express-ts";

import { createDbConnection, apiTokenMiddleware, initDiContainer } from './core';
import { ErrorMessages } from './messages';

import "./controller/";
import "./schema/";

import {
    AuthService,
    MailService,
    LoggerService,
    UserInfoService,
    StorageService,
    PostGroupService,
    PostService,
    NotificationService,
    ProfileService,
    CommonService,
    FeedService
} from './service';

import { ErrorSchema } from './schema/';
import { ValidationError } from 'class-validator';

async function bootstrapServer() {
    dotenv.config();

    await createDbConnection();

    const container = initDiContainer((mContainer: Container) => {
        mContainer.bind<AuthService>('AuthService').to(AuthService);
        mContainer.bind<UserInfoService>('UserInfoService').to(UserInfoService);
        mContainer.bind<MailService>('MailService').to(MailService);
        mContainer.bind<StorageService>('StorageService').to(StorageService);
        mContainer.bind<LoggerService>('LoggerService').to(LoggerService);
        mContainer.bind<PostGroupService>('PostGroupService').to(PostGroupService);
        mContainer.bind<PostService>('PostService').to(PostService);
        mContainer.bind<NotificationService>('NotificationService').to(NotificationService);
        mContainer.bind<ProfileService>('ProfileService').to(ProfileService);
        mContainer.bind<CommonService>('CommonService').to(CommonService);
        mContainer.bind<FeedService>('FeedService').to(FeedService);
    });

    const expressServer = new InversifyExpressServer(container, null, { rootPath: "/api" });

    const port: number = Number(process.env.APP_PORT) ?? 3000;

    expressServer
        .setConfig(setExpressMiddlewares)
        .setErrorConfig(setExpressErrorHandler(container.get<LoggerService>('LoggerService')))
        .build()
        .listen(port, () => container.get<LoggerService>('LoggerService').info(`Started on port ${port}. Swagger: http://localhost:${port}/api-docs/swagger`));
}

function setExpressMiddlewares(app: express.Application) {
    app.set('etag', false);

    app.use(compression());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(jwt({ secret: String(process.env.JWT_SECRET), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use('/api', apiTokenMiddleware);

    app.use('/api-docs/swagger', express.static('src/swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(swagger.express(
        {
            definition: {
                info: {
                    title: 'Cosma API',
                    contact: {
                        name: "Cosma",
                        url: "https://www.cosma-app.ru",
                        email: "team@cosma-app.ru"
                    },
                    version: "0.0.1",
                },
                schemes: ['http', 'https'],
                basePath: '/api/',
                securityDefinitions: {
                    'Api-Key': {
                        type: 'apiKey',
                        name: 'Api-Key',
                        in: 'header'
                    },
                    'Authorization': {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header'
                    }
                }
            },
        }
    ));
}

function setExpressErrorHandler(loggerService: LoggerService) {
    return (app: express.Application) => {
        app.use((err: any, req: express.Request, res: express.Response, next: any) => {
            if (err instanceof ErrorSchema) {
                res.status(err.httpCode).send(err.preview());
            } else if (err.length && err[0] instanceof ValidationError) {
                res.status(400).send(ErrorMessages.ValidationFailed.preview());
            } else if (err?.name === 'UnauthorizedError') {
                res.status(401).send(ErrorMessages.InvalidToken.preview());
            } else {
                loggerService.error(err.stack);
                res.status(500).send(ErrorMessages.InternalError.preview());
            }
        });
    };
}

bootstrapServer();
