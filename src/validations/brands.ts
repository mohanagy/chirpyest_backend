import joi from '@hapi/joi';

const categories: any = ['fashion', 'beauty', 'home', 'lifestyle'];

export const brandsQuery = joi.object({
  isTrending: joi.string(),
  category: joi.valid(...categories),
});

const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export const shortLinksValidate = joi.object({
  url: joi
    .string()
    .regex(urlPattern)
    .rule({
      message: 'url must be a valid URL',
    })
    .required(),
});
