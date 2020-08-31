import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { httpResponse, dto } from '../../helpers';
import { brandsService, paymentsService, paymentsTransitionsService } from '../../services';

/**
 * @description getImpactRadiusWebhookData is a controller used receive Impact Radius webhook events
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} next middleware function
 * @return {Promise<Response>} object contains success status
 */

export const getBrands = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const { isTrending, category } = request.query;
  const filterOptions: any = {
    isDeleted: false,
    isExpired: false,
  };
  if (isTrending === 'true') {
    filterOptions.isTrending = true;
  } else if (category) {
    filterOptions.category = category;
  }

  const filter = dto.generalDTO.filterData(filterOptions);
  const brands = await brandsService.getBrands(filter, transaction);
  await transaction.commit();
  return httpResponse.ok(response, brands);
};

export const getPayments = async (
  _request: Request,
  response: Response,
  next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  try {
    const {
      calculateRakutenUserPayment,
      calculateImpactRadiusBothAccountsPayment,
      calculateCjUserPayment,
    } = paymentsService;
    const paymentsArr = await Promise.all([
      calculateRakutenUserPayment(),
      calculateImpactRadiusBothAccountsPayment(),
      calculateCjUserPayment(),
    ]);
    const flatPayments = paymentsArr.flat();
    await paymentsTransitionsService.createPaymentsTransactions(flatPayments, transaction);
    await transaction.commit();
    return httpResponse.ok(response, flatPayments);
  } catch (err) {
    await transaction.rollback();
    return next(err);
  }
};

/**
 * @description shortLinks is a controller used to short network links
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const shortLinks = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const userId = dto.usersDTO.userId(request);
  const bodyData = dto.generalDTO.bodyData(request);
  const { url } = bodyData;
  const trackableLink = await brandsService.checkUrlNetwork(url, userId.id, transaction);
  const { shortUrl } = await brandsService.convertLink(trackableLink);

  await transaction.commit();
  return httpResponse.ok(response, shortUrl);
};

export const getBrandsForAdmin = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const { isTrending, category } = request.query;
  let filter = {};
  if (isTrending === 'true') {
    filter = dto.generalDTO.filterData({
      isTrending: true,
    });
  } else if (category) {
    filter = dto.generalDTO.filterData({
      category,
    });
  }
  const brands = await brandsService.getBrandsWithDetails(filter, transaction);
  await transaction.commit();
  return httpResponse.ok(response, brands);
};
