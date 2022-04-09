"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_jwt_1 = __importDefault(require("express-jwt"));
require("reflect-metadata");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const swagger = __importStar(require("swagger-express-ts"));
const helper_1 = require("./helper/");
require("./controller/");
require("./schema/");
const service_1 = require("./service");
const schema_1 = require("./schema/");
function bootstrapServer() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        yield helper_1.createDbConnection();
        const container = new inversify_1.Container();
        container.bind('Logger').toConstantValue(helper_1.logger);
        container.bind('AuthService').to(service_1.AuthService);
        container.bind('MailService').to(service_1.MailService);
        const expressServer = new inversify_express_utils_1.InversifyExpressServer(container, null, { rootPath: "/api" });
        const port = (_a = Number(process.env.APP_PORT)) !== null && _a !== void 0 ? _a : 3000;
        expressServer
            .setConfig(setExpressMiddlewares)
            .setErrorConfig(setExpressErrorHandler)
            .build()
            .listen(port, () => helper_1.logger.info(`Started on port ${port}. Swagger: http://localhost:${port}/api-docs/swagger`));
    });
}
function setExpressMiddlewares(app) {
    app.set('etag', false);
    app.use(compression_1.default());
    app.use(cors_1.default());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use(express_jwt_1.default({ secret: String(process.env.JWT_SECRET), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use('/api', helper_1.apiTokenMiddleware);
    app.use('/api-docs/swagger', express_1.default.static('src/swagger'));
    app.use('/api-docs/swagger/assets', express_1.default.static('node_modules/swagger-ui-dist'));
    app.use(swagger.express({
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
    }));
}
function setExpressErrorHandler(app) {
    app.use((err, req, res, next) => {
        if (err instanceof schema_1.ErrorSchema) {
            res.status(400).send(err);
        }
        else if ((err === null || err === void 0 ? void 0 : err.name) === 'UnauthorizedError') {
            res.status(401).send(helper_1.ErrorMessages.InvalidToken);
        }
        else {
            helper_1.logger.error(err.stack);
            res.status(500).send(helper_1.ErrorMessages.InternalError);
        }
    });
}
bootstrapServer();
