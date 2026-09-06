import winston from 'winston';
import { env } from './env';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Pretty format for development
const prettyFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp as string}] ${level}: ${message as string}${stack ? `\n${stack as string}` : ''}${metaStr}`;
  }),
);

// JSON format for production (structured logging for log aggregators)
const productionFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: env.LOG_FORMAT === 'json' ? productionFormat : prettyFormat,
  transports: [
    new winston.transports.Console(),
    // Add file transport in production
    ...(env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 10,
          }),
        ]
      : []),
  ],
  exitOnError: false,
});

// Add http level for Morgan integration
winston.addColors({ http: 'magenta' });

export default logger;
