import axios from 'axios';
import config from '../../config';
import { dto } from '../../helpers';
import { BrandsAttributes } from '../../interfaces';
import { createBrands } from './brands';

const { accountSID, authToken } = config.affiliateNetworks.impactRadiusConfig;

const baseImpactApiUrl = `https://${accountSID}:${authToken}@api.impact.com/Mediapartners/${accountSID}`;
const campaignsEndpoint = `${baseImpactApiUrl}/Campaigns.json`;
const campaignsEndpoint2 = `${baseImpactApiUrl}/Reports/4016?PageSize=20000&Page=1&contract_status=Active`;

export const getImpactRadiusBrands = async (): Promise<any> => {
  const { data: campaignsEndpointData } = await axios.get(campaignsEndpoint);
  const { data: campaignsEndpoint2Data } = await axios.get(campaignsEndpoint2);
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
