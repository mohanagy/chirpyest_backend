/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { httpResponse } from '../../helpers';
import { brandsService, paymentsService } from '../../services';

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
  transaction: Transaction,
): Promise<Response> => {
  const brands = await brandsService.getBrands();
  transaction.commit();
  return httpResponse.ok(response, brands);
};

export const getPayments = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  try {
    // const brands2 = await paymentsService.calculateImpactRadiusUserPayment();
    // const brands = await paymentsService.calculateRakutenUserPayment();
    const brandsCj = await paymentsService.calculateCjUserPayment();
    transaction.commit();
    return httpResponse.ok(response, brandsCj);
  } catch (err) {
    console.log('err', err);
    return err;
  }
};
