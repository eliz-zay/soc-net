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
exports.MailService = void 0;
const winston_1 = __importDefault(require("winston"));
const inversify_1 = require("inversify");
const axios_1 = __importDefault(require("axios"));
let MailService = class MailService {
    constructor(logger) {
        this.logger = logger;
    }
    sendMail(mail) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                yield this.updateToken();
            }
            const body = {
                email: {
                    html: Buffer.from((_a = mail.html) !== null && _a !== void 0 ? _a : '').toString('base64'),
                    text: mail.text,
                    subject: mail.subject,
                    from: {
                        name: mail.senderName,
                        email: mail.sourseAddress
                    },
                    to: mail.destinationAddresses.map((email) => ({ email })),
                }
            };
            const response = yield axios_1.default.post(`https://api.sendpulse.com/smtp/emails`, body, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
            });
            this.logger.info(`E-mail with subject '${mail.subject}' to user(s) ${mail.destinationAddresses.join(', ')}`);
            console.log(response.data);
        });
    }
    updateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                grant_type: 'client_credentials',
                client_id: process.env.SENDPULSE_ID,
                client_secret: process.env.SENDPULSE_SECRET
            });
            const response = yield axios_1.default.post(`https://api.sendpulse.com/oauth/access_token`, body, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            this.token = response.data.access_token;
            setTimeout(() => this.token = null, response.data.expires_in * 3 / 4);
        });
    }
};
MailService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Logger')),
    __metadata("design:paramtypes", [Object])
], MailService);
exports.MailService = MailService;
