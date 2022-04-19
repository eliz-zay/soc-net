import { inject, injectable } from 'inversify';
import { getRepository, Repository } from 'typeorm';

import { LoggerService } from '.';
import { EMailType, MailType } from '../model';
import { assert } from '../core';

export interface Mail {
    destinationAddresses: string[];
    type: EMailType;
    data: object;
}

@injectable()
export class MailService {
    private mailTypeRepository: Repository<MailType>;

    constructor(@inject('LoggerService') private logger: LoggerService) {
        this.mailTypeRepository = getRepository(MailType);
    }

    public async sendMail(mail: Mail) {
        const { title, text } = await this.buildMessage(mail.type, mail.data);

        // TODO: send actual e-mail

        this.logger.debug(`New e-mail for ${mail.destinationAddresses.join(', ')}:`);
        this.logger.debug({ title, text });
    }

    public async buildMessage(type: EMailType, data: object): Promise<{ title: string; text: string }> {
        const mailType = await this.mailTypeRepository.findOne({ code: type });

        assert(!!mailType, 'mailType must be defined');

        let title = mailType!.titleTemplate;
        let text = mailType!.textTemplate;

        Object.entries(data).forEach(([key, value]) => {
            title = title.replace(new RegExp(`{${key}}`, "gi"), value);
            text = text.replace(new RegExp(`{${key}}`, "gi"), value);
        });

        return { title, text };
    }
}
