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

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp({ format: timezoned })),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.Console({
            level: 'error',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});

export default logger;