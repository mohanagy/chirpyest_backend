import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import express, { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import morgan from 'morgan';
import fetch from 'node-fetch';
import config from './config';
import { expressWinstonLogger, httpResponse, logger } from './helpers';
import cognito from './helpers/cognito';
import { messages } from './helpers/constants';
import { ErrnoException } from './interfaces';
import routes from './routes';
import { job } from './tasks/commissionJunction';

const app = express();

app.use(cookieParser());

cognito(app);
job.start();
(global as any).fetch = fetch;
Sentry.init({
  dsn: config.server.SentryDNS,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler() as RequestHandler);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, Content-Type,Authorization, Access-Control-Request-Headers',
  );

  res.on('finish', () => {
    const transaction = app.get('transaction');
    if (transaction) app.set('transaction', undefined);
  });
  if (req.method === 'OPTIONS') return res.status(200).json({});
  return next();
});

app.use(morgan('dev'));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(expressWinstonLogger);
}

app.use('/', routes);
app.use(Sentry.Handlers.errorHandler() as ErrorRequestHandler);
// catch 404
app.use((_req, res) => {
  return httpResponse.notFound(res, messages.general.notFound);
});

// error handler
app.use(async (error: ErrnoException, request: Request, response: Response, _next: NextFunction) => {
  logger.error('Express error middlware: ', error);
  const transaction = request.app.get('transaction');
  if (transaction && !['rollback', 'commit'].includes(transaction.finished)) {
    await transaction.rollback();
    app.set('transaction', undefined);
  }
  response.status(error.status || error.value ? 400 : 500);
  return response.json({
    message: error.message || (error.error ? error.error.details : null),
  });
});

export default app;
