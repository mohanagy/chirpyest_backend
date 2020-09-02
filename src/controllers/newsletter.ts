import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { constants, dto, httpResponse } from '../helpers';

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
  const { email } = dto.generalDTO.bodyData(request);

  const filter = dto.generalDTO.filterData({
    email,
  });
  const user = await newsletterService.getUserSubscribe(filter, transaction).catch(async () => {
    await transaction.rollback();
  });
  if (!user) {
    const data = {
      email,
    };
    await newsletterService.subscribeUser(data, transaction);
    await transaction.commit();
  } else {
    const { isSubscribed } = user;
    const data = { isSubscribed: !isSubscribed };
    if (!isSubscribed) await newsletterService.updateUserSubscribe(filter, data, transaction);
  }
  return httpResponse.ok(response, { email }, constants.messages.newsletter.userSubscribed);
};
