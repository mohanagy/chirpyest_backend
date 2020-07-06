import joi from '@hapi/joi';

export const updateUserProfile = joi.object({
  name: joi.string().optional(),
  newsletterSubscription: joi.boolean().optional(),
  image: joi.string().uri(),
  paypalAccount: joi.string().email().optional(),
});
