import { constants } from '../../helpers';
import { Brands } from '../../database';

const { trendingBrands, lifestyle, home, fashion, beauty } = constants;

const trendingIds = trendingBrands.reduce((acc: any[], curr) => {
  if (curr.id) {
    acc.push(curr.id);
  }
  return acc;
}, []);

export const updateTrending = () => {
  return Brands.update(
    { isTrending: true },
    {
      where: {
        brandId: trendingIds,
      },
    },
  );
};

updateTrending();

export const updateCategory = () => {
  Promise.all([
    Brands.update(
      { category: 'lifestyle' },
      {
        where: {
          brandId: lifestyle,
        },
      },
    ),
    Brands.update(
      { category: 'home' },
      {
        where: {
          brandId: home,
        },
      },
    ),
    Brands.update(
      { category: 'fashion' },
      {
        where: {
          brandId: fashion,
        },
      },
    ),
    Brands.update(
      { category: 'beauty' },
      {
        where: {
          brandId: beauty,
        },
      },
    ),
  ]);
};
