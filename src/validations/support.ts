import joi from '@hapi/joi';

export const contactUs = joi.object({
  email: joi.string().email().required(),
  name: joi.string().required(),
  type: joi.string().required(),
  body: joi.string().required(),
});
