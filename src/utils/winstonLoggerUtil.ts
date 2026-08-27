import 'winston-daily-rotate-file';
import winston from 'winston';

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
});

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
    });
};

/* logger class with different methods to capture logs. */
class WinstonLogger {
    /* logging used by entire application API's */
    public static logger = winston.createLogger({
        format: winston.format.combine(winston.format.timestamp({ format: timezoned })),
        /* info also tracks error and warn levels so a separate error level transport is not required */
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(winston.format.colorize(), winston.format.simple())
            })
        ]
    });
}

export default WinstonLogger;