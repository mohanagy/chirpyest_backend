import axios from 'axios';

const url1 =
  'https://IRuXc4No43oX1719254YMvCSfVu3CcNYg1:yCBYr.9ib-mamkXnBjqkVCYkeW7FRDdz@api.impact.com/Mediapartners/IRuXc4No43oX1719254YMvCSfVu3CcNYg1/Campaigns.json';

// const url2 =
// 'https://IRuXc4No43oX1719254YMvCSfVu3CcNYg1:yCBYr.9ib-mamkXnBjqkVCYkeW7FRDdz@api.impact.com/Mediapartners/IRuXc4No43oX1719254YMvCSfVu3CcNYg1/Reports/4016';

const url2 =
  'https://IRuXc4No43oX1719254YMvCSfVu3CcNYg1:yCBYr.9ib-mamkXnBjqkVCYkeW7FRDdz@api.impact.com/Mediapartners/IRuXc4No43oX1719254YMvCSfVu3CcNYg1/Reports/4016?PageSize=20000&Page=1&contract_status=Active';

export const getImpactRadiusBrands = async (): Promise<any> => {
  try {
    const { data: url1Data } = await axios.get(url1);
    const { data: url2Data } = await axios.get(url2);
    const cleanList: any = [];
    url1Data.Campaigns.forEach((campaign: any) => {
      url2Data.Records.forEach((record: any) => {
        if (record.Name === campaign.CampaignName) {
          const updatedCampaign = { ...campaign };
          updatedCampaign.Payout = record.Payout;
          cleanList.push(updatedCampaign);
        }
      });
    });

    // save cleanList to the db

    return cleanList;
  } catch (err) {
    console.log('err', err);
  }
};
