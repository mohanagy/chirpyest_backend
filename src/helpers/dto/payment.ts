export const impactRadiusPaymentDto = (data: any) => {
  return {
    userId: data.subId1,
    actionId: data.actionId,
    status: data.status,
    statusDetail: data.statusDetail,
    payout: data.payout,
    originalPayout: data.originalPayout,
    vat: data.vat,
    subId1: data.subId1,
    subId2: data.subId2,
    subId3: data.subId3,
    sharedId: data.sharedId,
    customerId: data.customerId,
  };
};
