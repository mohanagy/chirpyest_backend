import joi from '@hapi/joi';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordComplexity = require('joi-password-complexity');

export const signUpValidation = joi.object({
  email: joi.string().email().required(),
  password: passwordComplexity(),
  terms_conds_accepted: joi.boolean().valid(true).required(),
});
