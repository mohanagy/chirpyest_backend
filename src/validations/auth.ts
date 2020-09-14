import joi from '@hapi/joi';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 25,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
  requirementCount: 8,
};

export const signUpValidation = joi.object({
  email: joi.string().email().required(),
  password: passwordComplexity(complexityOptions),
  termsCondsAccepted: joi.boolean().valid(true).required(),
  newsletterSubscription: joi.boolean().optional(),
  extensionDownloaded: joi.boolean().optional(),
});
