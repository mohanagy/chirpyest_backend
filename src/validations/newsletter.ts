import joi from '@hapi/joi';

export const subscribeToNewsLetterValidation = joi.object({
  email: joi.string().email().required(),
});
