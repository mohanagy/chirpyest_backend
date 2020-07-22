import { expect } from 'chai';
import { CommissionJunctionPayload } from 'src/interfaces';
import request from 'supertest';
import app from '../../app';
import config from '../../config';
import * as db from '../../database';
import { authHelpers, convertToCents, dto } from '../../helpers';
import { usersServices } from '../../services';

const commissionJunctionResponse: CommissionJunctionPayload = [
  {
    actionTrackerId: 372642,
    advertiserId: 4258829,
    actionTrackerName: 'Nook and Digital Product Sales',
    advertiserName: 'Barnes & Noble',
    postingDate: '2020-07-14T13:30:19Z',
    pubCommissionAmountUsd: 12.5,
    shopperId: 123,
    saleAmountUsd: 0,
    correctionReason: 'Deposit',
    orderDiscountUsd: 0,
    aid: 13261435,
    orderId: 4098759842,
    commissionId: 2672869066,
    saleAmountPubCurrency: '0',
    orderDiscountPubCurrency: '0',
  },
  {
    actionTrackerId: 372642,
    advertiserId: 4258829,
    actionTrackerName: 'Nook and Digital Product Sales',
    advertiserName: 'Barnes & Noble',
    postingDate: '2020-07-17T15:45:25Z',
    pubCommissionAmountUsd: 0.555,
    shopperId: 123,
    saleAmountUsd: 0,
    correctionReason: 'OTHER_REASON',
    orderDiscountUsd: 0,
    aid: 13261435,
    orderId: 4098759842,
    commissionId: 2674255473,
    saleAmountPubCurrency: '0',
    orderDiscountPubCurrency: '0',
  },
];
const financialDashboard = {
  id: 1,
  userId: 1,
  pending: commissionJunctionResponse[0].pubCommissionAmountUsd,
  receivableMilestone: 0,
  earnings: 0,
  lastClosedOut: 0,
  createdAt: '2020-07-22T13:06:14.333Z',
  updatedAt: '2020-07-22T13:06:14.333Z',
};
const {
  affiliateNetworks: { commissionJunctionConfig },
} = config;

const email = `naji+${Math.random().toString(36).substring(7)}@kiitos-tech.com`;

describe('Test Commission Junction webhook controller', () => {
  let cognitoId: string;
  const filter = dto.generalDTO.filterData({ email });
  before(async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true });
    const {
      body: {
        data: { cognitoId: cognitoIdResult, id },
      },
    } = response;
    cognitoId = cognitoIdResult;
    commissionJunctionResponse[0].shopperId = id;
  });
  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await authHelpers.removeCognitoUser(app, cognitoId);
    }
  });

  it("Should not allow any request doesn't have secret key ", async () => {
    await request(app)
      .post(`/api/v1/affiliate-networks/commission-junction/webhook`)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('Should  allow any request has secret key but should blocks because no data', async () => {
    await request(app)
      .post(`/api/v1/affiliate-networks/commission-junction/webhook`)
      .expect('Content-Type', /json/)
      .set('x-webhook-secret', commissionJunctionConfig.cJPersonalKey)
      .expect(409);
  });

  it('Should allow any request does have  secret key and body and it will be stored', async () => {
    await request(app)
      .post(`/api/v1/affiliate-networks/commission-junction/webhook`)
      .expect('Content-Type', /json/)
      .set('x-webhook-secret', commissionJunctionConfig.cJPersonalKey)
      .send(commissionJunctionResponse)
      .expect(200);

    const cJTransactions = await db.CommissionJunctionTransactions.findAll({
      raw: true,
    });
    const financialDashboardData = await db.FinancialDashboard.findOne({
      where: { userId: commissionJunctionResponse[0].shopperId },
      raw: true,
    });
    expect(cJTransactions.length).equal(commissionJunctionResponse.length);
    expect(Number(cJTransactions[0].commissionId)).equal(commissionJunctionResponse[0].commissionId);
    expect(financialDashboardData?.pending).equal(convertToCents(financialDashboard.pending));

    await db.CommissionJunctionTransactions.destroy({
      where: {
        advertiserName: commissionJunctionResponse[0].advertiserName,
      },
    });
    await db.FinancialDashboard.destroy({
      where: { userId: commissionJunctionResponse[0].shopperId },
    });
  });
});
