import joi from '@hapi/joi';

export const updateUserProfile = joi.object({
  name: joi.string().optional(),
  newsletterSubscription: joi.boolean().optional(),
  image: joi.string().uri().optional(),
  paypalAccount: joi.string().email().optional(),
  username: joi.string().optional(),
});
