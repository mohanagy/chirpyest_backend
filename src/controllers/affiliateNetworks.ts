import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRakutenWebhookData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('req.body', req.body);
  console.log('req.headers', req.headers);
  // validate the data ??
  // start transaction
  // save to db
  // update the pending money
  res.status(200).send('ok');
};
