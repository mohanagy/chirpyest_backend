import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { constants, dto, httpResponse, logger } from '../helpers';

import { newsletterService } from '../services';

/**
 * @description subscribeToNewsLetter is a controller used to fetch user profile data
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const subscribeToNewsLetter = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`subscribeToNewsLetter : started `);
  const { email } = dto.generalDTO.bodyData(request);

  logger.info(`subscribeToNewsLetter : email :${email} `);

  const filter = dto.generalDTO.filterData({
    email,
  });
  const user = await newsletterService.getUserSubscribe(filter, transaction).catch(async () => {});
  logger.info(`subscribeToNewsLetter : check if user is has a record :${user} `);
  if (!user) {
    const data = {
      email,
    };
    logger.info(`subscribeToNewsLetter : check if add new row for subscription `);
    await newsletterService.subscribeUser(data, transaction);
  } else {
    logger.info(`subscribeToNewsLetter : if the user already has a record , we will enable the subscription `);
    const { isSubscribed } = user;
    const data = { isSubscribed: !isSubscribed };
    if (!isSubscribed) await newsletterService.updateUserSubscribe(filter, data, transaction);
  }
  await transaction.commit();
  logger.info(`subscribeToNewsLetter : ended`);
  return httpResponse.ok(response, { email }, constants.messages.newsletter.userSubscribed);
};
