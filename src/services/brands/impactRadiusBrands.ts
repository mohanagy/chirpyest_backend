import axios from 'axios';
import { constants, dto } from '../../helpers';
import { BrandsAttributes } from '../../interfaces';
import { createBrands } from './brands';

export const getImpactRadiusBrands = async (): Promise<Array<BrandsAttributes>> => {
  const { data: campaignsEndpointData } = await axios.get(constants.campaignsEndpoint);
  const { data: campaignsEndpoint2Data } = await axios.get(constants.campaignsEndpoint2);
  const impactRadiusBrandsList: BrandsAttributes[] = [];
  campaignsEndpointData.Campaigns.forEach((campaign: any) => {
    campaignsEndpoint2Data.Records.forEach((record: any) => {
      if (record.Name === campaign.CampaignName) {
        const updatedCampaign = { ...campaign };
        updatedCampaign.Payout = record.Payout;
        const cleanBrand = dto.impactRadiusDTO.impactRadiusBrands(updatedCampaign);
        impactRadiusBrandsList.push(cleanBrand);
      }
    });
  });

  await createBrands(impactRadiusBrandsList);
  return impactRadiusBrandsList;
};
