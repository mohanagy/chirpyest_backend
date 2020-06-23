import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status-codes';
import FailureResponse from './FailureResponse';
import SuccessResponse from './SuccessResponse';

export default {
  created: (response: Response, data: any, message: string): Response =>
    response.status(httpStatus.CREATED).json(new SuccessResponse(data, message)),
  ok: (response: Response, data: any, message: string): Response =>
    response.status(httpStatus.OK).json(new SuccessResponse(data, message)),
  badRequest: (response: Response, message: string): Response =>
    response.status(httpStatus.BAD_REQUEST).json(new FailureResponse(message)),
  notFound: (response: Response, message: string): Response =>
    response.status(httpStatus.NOT_FOUND).json(new FailureResponse(message)),
  unAuthorized: (response: Response, message: string): Response =>
    response.status(httpStatus.UNAUTHORIZED).json(new FailureResponse(message)),
  forbidden: (response: Response, message: string): Response =>
    response.status(httpStatus.FORBIDDEN).json(new FailureResponse(message)),
  notAllowedMethod: (request: Request, response: Response, message: string): Response =>
    response
      .status(httpStatus.METHOD_NOT_ALLOWED)
      .json(
        new FailureResponse(
          message || `The requested resource does not support http method '${request.method}'.'${request.path}'`,
        ),
      ),
  payLoadTooLarge: (response: Response, message: string): Response =>
    response.status(httpStatus.REQUEST_TOO_LONG).json(new FailureResponse(message || 'Request payload too large.')),
  internalServerError: (next: NextFunction, error: Error): void => next(error),
};
