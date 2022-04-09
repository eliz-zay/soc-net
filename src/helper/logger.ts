import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
    return JSON.stringify({ time: timestamp, level, message }, null, '\t');
});

export const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console({ level: 'info' })]
});
