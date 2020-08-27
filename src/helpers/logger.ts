import DatadogWinston from 'datadog-winston';
import expressWinston from 'express-winston';
import winston from 'winston';
import config from '../config';

const DatadogWinstonTransport = new DatadogWinston({
  apiKey: config.server.dataDogApiKey,
  service: process.env.HEROKU_APP_NAME || 'localhost',
  ddsource: 'node.js',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.add(DatadogWinstonTransport);
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export const expressWinstonLogger = expressWinston.logger({
  transports: [DatadogWinstonTransport],
  format: winston.format.json(),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query'],
  bodyBlacklist: ['password'],
  responseWhitelist: ['body'],
});

export default logger;
