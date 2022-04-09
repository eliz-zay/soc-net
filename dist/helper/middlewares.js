"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiTokenMiddleware = void 0;
const _1 = require("./");
function apiTokenMiddleware(req, res, next) {
    return req.header('Api-Token') !== process.env.API_TOKEN ? next(_1.ErrorMessages.IncorrectApiToken) : next();
}
exports.apiTokenMiddleware = apiTokenMiddleware;
