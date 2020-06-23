import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
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

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next('err');
});

// error handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: ErrnoException, req: Request, res: Response) => {
    // render the error page
    res.status(err.status || 500);
    return res.json({
      success: false,
      message: err.message,
    });
  },
);

export default app;
