import winston from "winston";
import path from 'path';
import fs from 'fs';

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
    const logDir = path.join(process.cwd(), 'logs');

    if(!fs.existsSync(logDir)){
        fs.mkdirSync(logDir);
    }

    logger.add(new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
    }));//? writes only error level logs to file calls logs/error.log

    logger.add(new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
    })); //? writes all logs for production to logs/combined.log
}

export default logger;