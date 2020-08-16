/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
// import moment from 'moment';
import { httpResponse } from '../../helpers';
import { brandsService, paymentsService, paymentsTransitionsService } from '../../services';
// import { savePaymentsData } from '../../services/payments/allPayments';

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
    const { calculateRakutenUserPayment, calculateImpactRadiusUserPayment, calculateCjUserPayment } = paymentsService;
    const paymentsArr = await Promise.all([
      calculateRakutenUserPayment(),
      calculateImpactRadiusUserPayment(),
      calculateCjUserPayment(),
    ]);
    const flatPyaments = paymentsArr.flat();
    console.log('flatPyaments', flatPyaments);
    const queyrRes = await paymentsTransitionsService.createPaymentsTransactions(flatPyaments, transaction);
    console.log('queyrRes', queyrRes);
    transaction.commit();
    return httpResponse.ok(response, paymentsArr);
  } catch (err) {
    console.log('err', err);
    transaction.rollback();
    return err;
  }
};
