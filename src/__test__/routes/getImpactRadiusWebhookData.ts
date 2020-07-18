import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import config from '../../config';
import * as db from '../../database';
import buildDb from '../../database/build';
import { dto } from '../../helpers';

const mockHookData = (userId: string): any => {
  return {
    token: config.affiliateNetworks.impactRadiusToken,
    campaignName: 'Best Buy U.S',
    actionTrackerId: '17897',
    campaignId: '10014',
    actionId: '10014.4579.3292',
    status: 'PENDING',
    statusDetail: '',
    adId: '614286',
    payout: '0.01',
    deltaPayout: '0.01',
    intendedPayout: '0.01',
    amount: '1.09',
    deltaAmount: '1.09',
    intendedAmount: '1.09',
    currency: 'USD',
    originalCurrency: 'USD',
    originalAmount: '1.09',
    eventDate: '2020-07-15T03:25:10-05:00',
    creationDate: '',
    lockingDate: '2020-09-16T00:00:00-05:00',
    clearedDate: '',
    referringDomain: '',
    landingPageUrl:
      'https://www.bestbuy.com/site/hot-wheels-worldwide-basic-car-styles-may-vary/6151804.p?skuId=6151804&irclickid=3Hn027QBNxyORfH0EOSREQreUkiRm6wSl0GxXU0&irgwc=1&ref=198&loc=COCOCOZY&acampID=0&mpid=1719254',
    subId1: userId,
    subId2: '',
    subId3: '',
    promoCode: '',
  };
};

describe('Test Impact Radius webhook controller', () => {
  let dummyData: any = null;

  before(async () => {
    dummyData = await buildDb();
  });

  it('Should create a new Impact raduis transaction and update related user credit', async () => {
    const { user1 } = dummyData.users;
    const hookData = mockHookData(user1.id);
    const impactRadiusTransactionData = dto.impactRadiusDTO.impactRadiusData(hookData);

    const impactRadiusTransactions = await db.ImpactRadiusTransactions.findAll();
    const financialDashboard = await db.FinancialDashboard.findOne({
      where: { userId: impactRadiusTransactionData.userId },
    });

    const result = await request(app)
      .get(`/api/v1/affiliate-networks/impact-radius/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(result.body.success).to.equal(true);

    const impactRadiusTransactionsAfter = await db.ImpactRadiusTransactions.findAll();
    const financialDashboardAfter = await db.FinancialDashboard.findOne({
      where: { userId: impactRadiusTransactionData.userId },
    });
    expect(impactRadiusTransactionsAfter.length).to.equal(impactRadiusTransactions.length + 1);
    expect(financialDashboardAfter?.pending).to.equal(financialDashboard!.pending + impactRadiusTransactionData.payout);
  });

  it('Should create a new Impact Radius transaction and if user first it should create new dashboard record and store the correct value', async () => {
    const { user2 } = dummyData.users;
    const hookData = mockHookData(user2.id);

    const impactRadiusTransactionData = dto.impactRadiusDTO.impactRadiusData(hookData);

    const impactRadiusTransactions = await db.ImpactRadiusTransactions.findAll();
    const financialDashboard = await db.FinancialDashboard.findOne({
      where: { userId: impactRadiusTransactionData.userId },
    });

    const result = await request(app)
      .get(`/api/v1/affiliate-networks/impact-radius/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(result.body.success).to.equal(true);

    const impactRadiusTransactionsAfter = await db.ImpactRadiusTransactions.findAll();
    const financialDashboardAfter = await db.FinancialDashboard.findOne({
      where: { userId: impactRadiusTransactionData.userId },
    });

    expect(impactRadiusTransactionsAfter.length).to.equal(impactRadiusTransactions.length + 1);
    expect(financialDashboard).to.equal(null);
    expect(financialDashboardAfter?.pending).to.equal(impactRadiusTransactionData.payout);
  });

  it('Should create a new Impact Radius transaction without a user and mark as zombie', async () => {
    const hookData = mockHookData('100');
    const impactRadiusTransactions = await db.ImpactRadiusTransactions.findAll();
    const result = await request(app)
      .get(`/api/v1/affiliate-networks/impact-radius/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    const impactRadiusTransactionsAfter = await db.ImpactRadiusTransactions.findAll();

    expect(result.body.success).to.equal(true);
    expect(impactRadiusTransactionsAfter.length).to.equal(impactRadiusTransactions.length + 1);
  });

  it('Should create a new rakuten transaction even with the a wrong userId', async () => {
    const hookData = mockHookData('afcg');
    const impactRadiusTransactions = await db.ImpactRadiusTransactions.findAll();
    const result = await request(app)
      .get(`/api/v1/affiliate-networks/impact-radius/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    const impactRadiusTransactionsAfter = await db.ImpactRadiusTransactions.findAll();

    expect(result.body.success).to.equal(true);
    expect(impactRadiusTransactionsAfter.length).to.equal(impactRadiusTransactions.length + 1);
  });
});
