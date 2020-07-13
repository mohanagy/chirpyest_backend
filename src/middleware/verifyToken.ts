import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { dto, httpResponse } from '../helpers';
import { verifyJWTToken } from '../helpers/auth';
import { messages } from '../helpers/constants';
import { usersServices } from '../services';

/**
 * @param  {Request} request represents the HTTP request
 * @param  {Response} response represents the HTTP response
 * @param  {NextFunction} next
 * @param  {Transaction} transaction
 * @returns Promise
 */
export const verifyToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  const header = dto.generalDTO.headerData(request);
  const { authorization } = dto.authDTO.authorizationToken(header);

  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    if (token === '') {
      await transaction.rollback();
      return httpResponse.unAuthorized(response, messages.auth.notAuthorized);
    }
    const user = await verifyJWTToken(token).catch(() => {
      return undefined;
    });

    if (user) {
      const { sub } = user;
      const filter = dto.generalDTO.filterData({ cognitoId: sub });
      const userData = await usersServices.getUser(filter, transaction);

      if (!userData) {
        await transaction.rollback();
        return httpResponse.unAuthorized(response, messages.auth.notAuthorized);
      }
      request.app.set('user', userData);
      await transaction.commit();
      return next();
    }
  }
  await transaction.rollback();
  return httpResponse.unAuthorized(response, messages.auth.notAuthorized);
};
