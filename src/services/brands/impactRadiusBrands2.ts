import axios from 'axios';
import { dto } from '../../helpers';
import { BrandsAttributes } from '../../interfaces';
// import { createBrands } from './brands';

export const getImpactRadius2Brands = async (
  campaignsEndpoint: string,
  cashbackEndpoint: string,
): Promise<Array<BrandsAttributes>> => {
  const { data: campaignsEndpointData } = await axios.get(campaignsEndpoint);
  const { data: campaignsEndpoint2Data } = await axios.get(cashbackEndpoint);
  const impactRadiusBrandsList: BrandsAttributes[] = [];
  const obj: any = {};
  campaignsEndpointData.Campaigns.forEach((campaign: any) => {
    campaignsEndpoint2Data.Records.forEach((record: any) => {
      if (
        campaign.ContractStatus === 'Active' &&
        record.Name.toLowerCase().trim() === campaign.CampaignName.toLowerCase().trim()
      ) {
        const id = `${campaign.AdvertiserId}_${campaign.CampaignId}`;
        const updatedCampaign = { ...campaign };
        updatedCampaign.Payout = record.Payout;
        const cleanBrand = dto.impactRadiusDTO.impactRadiusBrands(updatedCampaign);
        if (!obj[id]) {
          impactRadiusBrandsList.push(cleanBrand);
          obj[id] = cleanBrand;
        }
      }
    });
  });

  console.log(impactRadiusBrandsList.length);
  // await createBrands(impactRadiusBrandsList);
  // return impactRadiusBrandsList;
  return impactRadiusBrandsList;
};
