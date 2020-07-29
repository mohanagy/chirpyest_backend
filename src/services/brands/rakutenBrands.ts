import csv from 'csvtojson';
import dotenv from 'dotenv';
import request from 'request';
import { dto } from '../../helpers';

// const csvUrl = `http://reportws.linksynergy.com/downloadreport.php?token=${process.env.RAKUTEN_SECURITY_TOKEN}&reportid=13`;
const csvUrl = `http://reportws.linksynergy.com/downloadreport.php?token=2c5a4274b06de54a548fc20c52fe4077c5537237eab55a609e7e771b89ac5962&reportid=13`;

dotenv.config();

export const getRakutenBrands = () => {
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
    .on('end', () => {
      // save to the [rakutenBrands] to the db
      return rakutenBrands;
    });
};
