import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import fetch from 'node-fetch';
import { httpResponse } from './helpers';
import cognito from './helpers/cognito';
import { messages } from './helpers/constants';
import { ErrnoException } from './interfaces';
import routes from './routes';

const app = express();

app.use(cookieParser());

cognito(app);

(global as any).fetch = fetch;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, Content-Type,Authorization, Access-Control-Request-Headers',
  );
  if (req.method === 'OPTIONS') return res.status(200).json({});
  return next();
});

app.use(logger('dev'));
app.use(express.json());

app.use('/', routes);

// catch 404
app.use((req, res) => {
  return httpResponse.notFound(res, messages.general.notFound);
});

// error handler
app.use(async (error: ErrnoException, request: Request, response: Response, _next: NextFunction) => {
  const transaction = request.app.get('transaction');
  if (transaction && !['rollback', 'commit'].includes(transaction.finished)) await transaction.rollback();
  response.status(error.status || error.value ? 400 : 500);
  return response.json({
    success: false,
    message: error.message || (error.error ? error.error.details : null),
  });
});

export default app;
