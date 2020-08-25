import csv from 'csvtojson';
import request from 'request';
import { constants, dto } from '../../helpers';
import { BrandsAttributes } from '../../interfaces';

export const getRakutenBrands = (): Promise<BrandsAttributes[]> => {
  return new Promise((resolve, reject) => {
    const rakutenBrands: Array<BrandsAttributes> = [];
    const cache: any = {};
    const csvReq: any = request.get(constants.rakutenBrandsUrl);

    csv()
      .fromStream(csvReq)
      .on('data', (data) => {
        const jsonString = data.toString('utf8');
        const json = JSON.parse(jsonString);
        if (json.Status === 'Active') {
          const cleanData: BrandsAttributes = dto.rakutenDTO.rakutenBrandsData(json);
          if (!cache[json.MID]) {
            rakutenBrands.push(cleanData);
            cache[json.MID] = true;
          }
        }
      })
      .on('done', async (error) => {
        if (error) {
          reject(error);
          throw error;
        }
        try {
          resolve(rakutenBrands);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
