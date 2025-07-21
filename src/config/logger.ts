import winston from "winston";
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;
//? these formating functions 
//* combine: combines multiple formating functions
//* timestamp: adds the time each log was created
//* printf: lets you create custom log string formats 
//* colorize: adds color to logs in the console for easier reading in dev
//* json: outputs logs as json - common for production logs

const env = process.env.NODE_ENV || 'development';
//? to determines the currnet environment 

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
}); //? create a custom log format string 

const consoleTransport = new winston.transports.Console({
    format: env === 'development' 
        ? combine(colorize(), timestamp(), logFormat)
        : combine(timestamp(), json())
}); //? sets up console logging behavior based on environment
//* in dev: logs are colorize, human-readable, custom
//* in prod: logs are structured in json format, ideal for toos to parse

const logger = winston.createLogger({
    level: env === 'development' ? 'debug' : 'info', 
    transports: [consoleTransport],
});//? creates the main logger instance
//* level determine the minimum severity of logs htat get logged:
//* debug -> dev captured everthing debug, info, warn, error
//* info -> prod ignores debug logs
//* adds the consoleTransport so logs show in the terminal

if(env === 'production') {
    logger.add(new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
    }));//? writes only error level logs to file calls logs/error.log

    logger.add(new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
    }));//? writes all logs to logs/combined.log
}

export default logger;