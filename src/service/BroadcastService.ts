import { inject, injectable } from "inversify";
import amqplib from 'amqplib';

import config from '../config.json';
import { EAuthEvent, IEmailVerification } from "../messaging-schema";

@injectable()
export class BroadcastService {
    constructor(@inject("MQChannel") private channel: amqplib.Channel) { }

    public broadcastEmailVerification(emailVerification: IEmailVerification) {
        this.channel.publish(
            config.eventsExchange,
            '',
            Buffer.from(JSON.stringify(emailVerification)),
            { type: EAuthEvent.EmailVerified }
        );
    }
}
