import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import { httpResponse } from './helpers';
import { ErrnoException } from './interfaces';
import indexRouter from './routes';

const app = express();

app.use(cookieParser());

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

app.use('/hello-world', indexRouter);

// catch 404
app.use((req, res) => {
  return httpResponse.notFound(res, 'Not found');
});

// error handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: ErrnoException, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    return res.json({
      success: false,
      message: err.message,
    });
  },
);

export default app;
