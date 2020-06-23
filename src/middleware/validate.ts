import { RequestHandler } from 'express';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({ passError: true });

/**
 * @description validateQuery is a function used to validate request body
 * with validation schema
 * @param {any} body request body
 * @return {object} validation result
 */
export const validateQuery = (body: any): RequestHandler => validator.query(body);
export const validateBody = (body: any): RequestHandler => validator.body(body);
export const validateParams = (body: any): RequestHandler => validator.params(body);
