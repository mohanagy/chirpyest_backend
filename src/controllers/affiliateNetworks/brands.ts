/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { brandsService } from '../../services';

/**
 * @description getImpactRadiusWebhookData is a controller used receive Impact Radius webhook events
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} next middleware function
 * @return {Promise<Response>} object contains success status
 */

export const getBrands = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  _transaction: Transaction,
): Promise<Response | void> => {
  console.log('hiiiiiiiiiiiiiiiiii');
  const cjBrands = await brandsService.getImpactRadiusBrands();
  response.send(cjBrands);
};
