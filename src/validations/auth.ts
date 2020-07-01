import joi from '@hapi/joi';
import passwordComplexity from 'joi-password-complexity';

export const signUpValidation = joi.object({
  email: joi.string().email().required(),
  password: passwordComplexity(),
  name: joi.string().required(),
  terms_conds_accepted: joi.boolean().valid(true).required(),
});
