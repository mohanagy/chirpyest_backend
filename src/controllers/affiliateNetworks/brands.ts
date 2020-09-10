import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { Op } from 'sequelize';
import { httpResponse, dto, constants, logger } from '../../helpers';
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
  logger.info(`getBrands : started`);

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
  logger.info(`getBrands : filterOptions : ${JSON.stringify(filterOptions)}`);
  const filter = dto.generalDTO.filterData(filterOptions);
  const brands = await brandsService.getBrands(filter, transaction);
  logger.info(`getBrands : brands result : ${JSON.stringify(filterOptions)}`);
  await transaction.commit();
  logger.info(`getBrands : ended`);

  return httpResponse.ok(response, brands);
};

export const getPayments = async (
  _request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response | void> => {
  logger.info(`getPayments : started`);
  const {
    calculateRakutenUserPayment,
    calculateImpactRadiusBothAccountsPayment,
    calculateCjUserPayment,
  } = paymentsService;

  logger.info(`getPayments : start gathering affiliate networks payments `);
  const affiliateNetworksPayments = await Promise.all([
    calculateRakutenUserPayment(),
    calculateImpactRadiusBothAccountsPayment(),
    calculateCjUserPayment(),
  ]);
  const flatPayments = affiliateNetworksPayments.flat();
  logger.info(`getPayments : create payment transactions with data : ${JSON.stringify(flatPayments)} `);
  await paymentsTransitionsService.createPaymentsTransactions(flatPayments, transaction);
  await transaction.commit();
  logger.info(`getPayments : ended`);
  return httpResponse.ok(response, flatPayments);
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
  logger.info(`shortLinks : started`);
  const userId = dto.usersDTO.userId(request);
  const bodyData = dto.generalDTO.bodyData(request);
  logger.info(`shortLinks : userId : ${userId} , bodyData : ${JSON.stringify(bodyData)}`);
  const { url } = bodyData;
  const trackableLink = await brandsService.checkUrlNetwork(url, userId.id, transaction);
  logger.info(`shortLinks : trackableLink ${JSON.stringify(trackableLink)}`);
  if (!trackableLink) {
    logger.info(`shortLinks : no Trackable link `);
    await transaction.rollback();
    return httpResponse.forbidden(response, constants.messages.brands.linkNotRelatedToOurNetwork);
  }

  const { shortUrl } = await brandsService.convertLink(trackableLink);
  logger.info(`shortLinks : generated shortUrl :${JSON.stringify(shortUrl)} `);

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
  logger.info(`getBrandsForAdmin : started`);
  const filter = dto.generalDTO.filterData({
    isExpired: { [Op.not]: true },
  });
  logger.info(`getBrandsForAdmin : filter ${JSON.stringify(filter)}`);
  const brands = await brandsService.getBrands(filter, transaction);

  logger.info(`getBrandsForAdmin : brands ${JSON.stringify(brands)}`);

  const classifiedBrands = brandsService.classifyBrands(brands);

  logger.info(`getBrandsForAdmin : classifiedBrands ${JSON.stringify(classifiedBrands)}`);

  const brandsTransactions = await brandsService.getBrandsTransaction(classifiedBrands, transaction);

  logger.info(`getBrandsForAdmin : brandsTransactions ${JSON.stringify(brandsTransactions)}`);

  const allBrands = brands.reduce((acc: any, brand) => {
    const isBrandTransactionExist = brandsTransactions.find((element) => element.brandId === brand.brandId);
    if (isBrandTransactionExist) {
      acc.push({ ...brand, ...isBrandTransactionExist });
    } else {
      acc.push({ ...brand, total: 0 });
    }
    return acc;
  }, []);

  logger.info(`getBrandsForAdmin : allBrands ${JSON.stringify(allBrands)}`);

  await transaction.commit();
  return httpResponse.ok(response, allBrands);
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} _next
 * @param  {Transaction} transaction
 */
export const deleteBrandsForAdmin = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`deleteBrandsForAdmin : started`);

  const { id } = dto.generalDTO.paramsData(request);

  const filter = dto.generalDTO.filterData({ id });

  const brand = await brandsService.getBrandById(id, transaction);
  if (!brand) {
    await transaction.commit();
    return httpResponse.notFound(response, constants.messages.general.notFound);
  }

  await brandsService.disableBrand(filter, transaction);

  await transaction.commit();
  return httpResponse.ok(response, {}, 'brand has been deleted');
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} _next
 * @param  {Transaction} transaction
 */
export const updateBrandNameForAdmin = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`updateBrandNameForAdmin : started`);

  const { id } = dto.generalDTO.paramsData(request);
  const data = dto.generalDTO.bodyData(request);
  const filter = dto.generalDTO.filterData({ id });

  const brand = await brandsService.updateBrand(filter, data, transaction);
  await transaction.commit();
  return httpResponse.ok(response, brand, 'brand has been updated');
};
/**
 *
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} _next
 * @param  {Transaction} transaction
 */
export const getTopPerformingBrandsForAdmin = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  logger.info(`getTopPerformingBrandsForAdmin : started`);
  const filter = dto.generalDTO.filterData({
    isExpired: { [Op.not]: true },
  });
  logger.info(`getTopPerformingBrandsForAdmin : filter ${JSON.stringify(filter)}`);
  const brands = await brandsService.getBrands(filter, transaction);

  logger.info(`getTopPerformingBrandsForAdmin : brands ${JSON.stringify(brands)}`);

  const classifiedBrands = brandsService.classifyBrands(brands);

  logger.info(`getTopPerformingBrandsForAdmin : classifiedBrands ${JSON.stringify(classifiedBrands)}`);

  const brandsTransactions = await brandsService.getBrandsTransaction(classifiedBrands, transaction);

  logger.info(`getTopPerformingBrandsForAdmin : brandsTransactions ${JSON.stringify(brandsTransactions)}`);

  const allBrands = brands.reduce((acc: any, brand) => {
    const isBrandTransactionExist = brandsTransactions.find((element) => element.brandId === brand.brandId);
    if (isBrandTransactionExist) {
      acc.push({ ...brand, ...isBrandTransactionExist });
    } else {
      acc.push({ ...brand, revenue: 0 });
    }
    return acc;
  }, []);

  logger.info(`getTopPerformingBrandsForAdmin : allBrands ${JSON.stringify(allBrands)}`);

  await transaction.commit();
  return httpResponse.ok(response, allBrands);
};
