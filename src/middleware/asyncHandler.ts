import { NextFunction, Request, Response } from 'express';

/**
 * @description asyncHandler is a function used to wrap async routes
 * @param {function} fn the function or the controller which will be used for route
 * @return {*} result of executed function
 */
export default (fn: Function) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    return await fn(request, response, next);
  } catch (error) {
    return next(error);
  }
};
