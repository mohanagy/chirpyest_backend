import DatadogWinston from 'datadog-winston';
import winston from 'winston';
import config from '../config';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new DatadogWinston({
      apiKey: config.server.dataDogApiKey,
      service: 'chirpyest',
      ddsource: 'node.js',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
