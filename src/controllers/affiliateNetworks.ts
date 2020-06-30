import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRakutenWebhookData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('req.body', req.body);
  console.log('req.headers', req.headers);
  res.status(200).send('ok');
};
