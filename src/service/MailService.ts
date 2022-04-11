import { inject, injectable } from 'inversify';
import axios from 'axios';

import { Mail } from '../core';
import { LoggerService } from '.';

@injectable()
export class MailService {
    private token: string | null;

    constructor(@inject('LoggerService') private logger: LoggerService) {
    }

    public async sendMail(mail: Mail) {
        if (!this.token) {
            await this.updateToken();
        }

        const body = {
            email: {
                html: Buffer.from(mail.html ?? '').toString('base64'),
                text: mail.text,
                subject: mail.subject,
                from: {
                    name: mail.senderName,
                    email: mail.sourseAddress
                },
                to: mail.destinationAddresses.map((email) => ({ email })),
            }
        };

        const response = await axios.post(`https://api.sendpulse.com/smtp/emails`, body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
        });

        this.logger.info(`E-mail with subject '${mail.subject}' to user(s) ${mail.destinationAddresses.join(', ')}`);
    }

    private async updateToken() {
        const body = JSON.stringify({
            grant_type: 'client_credentials',
            client_id: process.env.SENDPULSE_ID,
            client_secret: process.env.SENDPULSE_SECRET
        });

        const response = await axios.post(`https://api.sendpulse.com/oauth/access_token`, body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        this.token = response.data.access_token;

        setTimeout(() => this.token = null, response.data.expires_in * 3 / 4);
    }
}
