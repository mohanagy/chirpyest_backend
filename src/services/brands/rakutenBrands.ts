import csv from 'csvtojson';
import request from 'request';
import config from '../../config';
import { dto } from '../../helpers';
import { createBrands } from './brands';

const csvUrl = `http://reportws.linksynergy.com/downloadreport.php?token=${config.affiliateNetworks.rakutenConfig.securityToken}&reportid=13`;

export const getRakutenBrands = () => {
  return new Promise((resolve, reject) => {
    const rakutenBrands: any = [];
    const csvReq: any = request.get(csvUrl);

    csv()
      .fromStream(csvReq)
      .on('data', (data) => {
        const jsonStr = data.toString('utf8');
        const json = JSON.parse(jsonStr);
        if (json.Status === 'Active') {
          const cleanData = dto.rakutenDTO.rakutenBrandsData(json);
          rakutenBrands.push(cleanData);
        }
      })
      .on('done', async (error) => {
        if (error) {
          reject(error);
          throw error;
        }
        try {
          await createBrands(rakutenBrands);
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
