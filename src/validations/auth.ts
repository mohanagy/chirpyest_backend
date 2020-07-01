import joi from '@hapi/joi';

export const signUpValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  name: joi.string().required(),
  terms_conds_accepted: joi.boolean().valid(true).required(),
});
