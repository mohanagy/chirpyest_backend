import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { httpResponse } from '../../helpers';
import { brandsService, paymentsService, paymentsTransitionsService } from '../../services';

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
  next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  try {
    const { calculateRakutenUserPayment, calculateImpactRadiusUserPayment, calculateCjUserPayment } = paymentsService;
    const paymentsArr = await Promise.all([
      calculateRakutenUserPayment(),
      calculateImpactRadiusUserPayment(),
      calculateCjUserPayment(),
    ]);
    const flatPyaments = paymentsArr.flat();
    await paymentsTransitionsService.createPaymentsTransactions(flatPyaments, transaction);
    transaction.commit();
    return httpResponse.ok(response, flatPyaments);
  } catch (err) {
    transaction.rollback();
    return next(err);
  }
};
