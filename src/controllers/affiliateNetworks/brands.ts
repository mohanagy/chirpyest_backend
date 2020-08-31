import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { Op } from 'sequelize';
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

/**
 *
 * @param {Request} _request
 * @param {Response} response
 * @param {NextFunction} _next
 * @param  {Transaction} transaction
 */
export const getBrandsForAdmin = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const filter = dto.generalDTO.filterData({
    isExpired: { [Op.not]: true },
  });
  const brands = await brandsService.getBrands(filter, transaction);

  const classifiedBrands = brandsService.classifyBrands(brands);

  const brandsTransactions = await brandsService.getBrandsTransaction(classifiedBrands, transaction);
  const allBrands = brands.reduce((acc: any, brand) => {
    const isBrandTransactionExist = brandsTransactions.find((element) => element.brandId === brand.brandId);
    if (isBrandTransactionExist) {
      acc.push({ ...brand, ...isBrandTransactionExist });
    } else {
      acc.push({ ...brand, total: 0 });
    }
    return acc;
  }, []);

  await transaction.commit();
  return httpResponse.ok(response, allBrands);
};
