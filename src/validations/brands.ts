import joi from '@hapi/joi';

const categories: any = ['fashion', 'beauty', 'home', 'lifestyle'];

export const brandsQuery = joi.object({
  isTrending: joi.string(),
  category: joi.valid(...categories),
});

export const shortLinksValidate = joi.object({
  url: joi.string().uri().required(),
});
