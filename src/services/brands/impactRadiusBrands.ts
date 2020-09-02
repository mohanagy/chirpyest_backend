import axios from 'axios';
import _ from 'lodash';
import { dto } from '../../helpers';
import { BrandsAttributes } from '../../interfaces';

export const getImpactRadiusBrands = async (
  campaignsEndpoint: string,
  cashbackEndpoint: string,
): Promise<Array<BrandsAttributes>> => {
  const { data: campaignsEndpointData } = await axios.get(campaignsEndpoint);
  const { data: campaignsEndpoint2Data } = await axios.get(cashbackEndpoint);
  const campaigns: any = {};

  campaignsEndpointData.Campaigns.forEach((campaign: any) => {
    const isActiveAndExist = campaign.ContractStatus === 'Active';
    if (isActiveAndExist) {
      const updatedCampaign = { ...campaign };
      const campaignName = campaign.CampaignName.toLowerCase().trim();

      if (!campaigns[campaignName]) {
        campaigns[campaignName] = updatedCampaign;
      }
    }
  });

  const groupPayoutByCampaing: any = {};
  campaignsEndpoint2Data.Records.forEach((record: any) => {
    const doesExist = campaigns[record.Name.toLowerCase().trim()];
    const isActive = record.Status.toLowerCase().trim() === 'active';
    const isContractActive = record.contract_status.toLowerCase().trim() === 'active';
    if (doesExist && isActive && isContractActive) {
      if (!groupPayoutByCampaing[record.Name]) {
        if (record.Payout.includes('%')) {
          const payoutNumber = Number(record.Payout.split('%')[0]);
          groupPayoutByCampaing[record.Name] = { percent: [payoutNumber], fixed: [] };
        } else {
          const fixedNumber = Number(record.Payout.split('Fixed')[1].trim());
          groupPayoutByCampaing[record.Name] = {
            fixed: [{ payout: fixedNumber, actionTracker: record.action_tracker }],
            percent: [],
          };
        }
      } else if (record.Payout.includes('%')) {
        const payoutNumber = Number(record.Payout.split('%')[0]);
        groupPayoutByCampaing[record.Name].percent.push(payoutNumber);
      } else {
        const fixedNumber = Number(record.Payout.split('Fixed')[1].trim());
        groupPayoutByCampaing[record.Name].fixed.push({
          payout: fixedNumber,
          actionTracker: record.action_tracker,
        });
      }
    }
  });

  const impactRadiusBrandsList = Object.entries(groupPayoutByCampaing).reduce((acc: any, curr) => {
    const current: any = curr;

    const [brand, payoutObject] = current;
    const { percent, fixed } = payoutObject;
    const maxPercent = _.max(percent);
    const maxFixed: any = _.maxBy(fixed, 'payout');
    if (percent.length && maxPercent) {
      const brandLower = brand.toLowerCase().trim();
      const brandWithData = { ...campaigns[brandLower], payout: `${Number(maxPercent) / 2}%` };
      const cleanBrand = dto.impactRadiusDTO.impactRadiusBrands(brandWithData);
      acc.push(cleanBrand);
    } else if (fixed.length && maxFixed.payout) {
      const brandLower = brand.toLowerCase().trim();
      const brandWithData = { ...campaigns[brandLower], payout: `Fixed ${Number(maxFixed.payout) / 2}$` };
      const cleanBrand = dto.impactRadiusDTO.impactRadiusBrands(brandWithData);
      acc.push(cleanBrand);
    } else {
      const brandLower = brand.toLowerCase().trim();
      const brandWithData = { ...campaigns[brandLower], payout: 0 };
      const cleanBrand = dto.impactRadiusDTO.impactRadiusBrands(brandWithData);
      acc.push(cleanBrand);
    }

    return acc;
  }, []);

  return impactRadiusBrandsList;
};
