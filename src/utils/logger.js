import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    }
};

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

const logger = process.env.ENV === 'production' ? prodLogger : devLogger;

export default logger;

