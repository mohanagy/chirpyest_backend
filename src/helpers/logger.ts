import DatadogWinston from 'datadog-winston';
import expressWinston from 'express-winston';
import winston from 'winston';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { S3StreamLogger } from 's3-streamlogger';
import config from '../config';

const s3stream = new S3StreamLogger({
  bucket: config.cognito.awsConfigs.bucketName,
  folder: 'logs',
  access_key_id: config.cognito.awsConfigs.awsS3AccessKeyId,
  secret_access_key: config.cognito.awsConfigs.awsS3SecretAccessKey,
  config: {
    region: config.cognito.awsConfigs.region,
  },
});

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
    new winston.transports.Stream({
      stream: s3stream,
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(DatadogWinstonTransport);
}

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
