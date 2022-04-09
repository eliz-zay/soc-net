import { injectable } from 'inversify';
import { createLogger, format, transports, Logger } from 'winston';

@injectable()
export class LoggerService {
    private logger: Logger;

    constructor() {
        const { combine, timestamp, printf } = format;

        const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
            return JSON.stringify({ time: timestamp, level, message }, null, '\t');
        });

        this.logger = createLogger({
            level: 'debug',
            format: combine(
                timestamp(),
                myFormat
            ),
            transports: [new transports.Console({ level: 'info' })]
        });
    }

    public async info(message: any) {
        this.logger.info(message);
    }

    public async debug(message: any) {
        if (process.env.NODE_ENV === 'development') {
            this.logger.info(message);
        }
    }

    public async warn(message: any) {
        this.logger.warn(message);
    }

    public async error(message: any) {
        this.logger.error(message);
    }
}
