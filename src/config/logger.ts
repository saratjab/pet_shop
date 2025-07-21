import winston from "winston";
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;

const env = process.env.NODE_ENV || 'development';

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

const consoleTransport = new winston.transports.Console({
    format: env === 'development' 
        ? combine(colorize(), timestamp(), logFormat)
        : combine(timestamp(), json())
});

const logger = winston.createLogger({
    level: env === 'development' ? 'debug' : 'info',
    transports: [consoleTransport],
});

if(env === 'production') {
    logger.add(new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
    }));

    logger.add(new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
    }));
}

// const logger = winston.createLogger({
//     level: ENV === 'development' ? 'debug' : 'info',
//     format: combine(
//         timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         logFormat,
//     ),
//     transports: [
//     new winston.transports.Console({
//       format: combine(
//         colorize(),
//         logFormat
//       )
//     }),
//     ...(ENV === 'production'
//       ? [new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' })]
//       : [])
//   ],
// });

export default logger;