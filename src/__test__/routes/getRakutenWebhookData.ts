import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import * as db from '../../database';
import buildDb from '../../database/build';
import { calculateCommission } from '../../helpers';

const transactionId1 = '11F79TL62R1GA54DAB3F3E6BADA181C8F';
const transactionId2 = '32F72NL19EFEB54CEFB3C3E6BADA181C8F';
const transactionId3 = '43F72NL19EFEB54CEFB3C3E6BADA181C8F';

const rakutenHookResponse = (transactionId: string, userId?: string) => {
  const data = {
    etransaction_id: transactionId,
    advertiser_id: 2149,
    sid: 3033696,
    order_id: '4412083389754',
    offer_id: '223073',
    sku_number: 'MP978098482820',
    quantity: 1,
    sale_amount: 99,
    commissions: 5.4,
    process_date: 'Fri Jun 19 2020 20:09:21 GMT+0000 (UTC)',
    transaction_date: 'Thu Jun 18 2020 09:35:00 GMT+0000 (UTC)',
    transaction_type: 'batch',
    product_name: '20000:27000:1027000:26100:26211:Fireseed One',
    currency: 'USD',
    is_event: 'N',
    commission_list_id: '',
    u1: userId,
  };
  return data;
};

describe('Test Rakuten webhook controller', () => {
  let dummyData: any = null;

  before(async () => {
    dummyData = await buildDb();
  });

  it('Should create a new rakuten transaction and update related user credit', async () => {
    const { user1 } = dummyData.users;
    const hookData = rakutenHookResponse(transactionId1, user1.id);
    const rakutenTransactions = await db.RakutenTransactions.findAll();
    const financialDashboard = await db.FinancialDashboard.findOne({ where: { userId: hookData.u1 } });
    const result = await request(app)
      .get(`/api/v1/affiliate-networks/rakuten/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(result.body.success).to.equal(true);

    const rakutenTransactionsAfter = await db.RakutenTransactions.findAll();
    const financialDashboardAfter = await db.FinancialDashboard.findOne({ where: { userId: hookData.u1 } });
    expect(rakutenTransactionsAfter.length).to.equal(rakutenTransactions.length + 1);
    expect(financialDashboardAfter?.pending).to.equal(
      financialDashboard!.pending + calculateCommission(Math.round(hookData.commissions * 100)),
    );
  });

  it('Should create a new rakuten transaction and if user first it should create new dashboard record and store the correct value', async () => {
    const { user2 } = dummyData.users;
    const hookData = rakutenHookResponse(transactionId1, user2.id);
    const rakutenTransactions = await db.RakutenTransactions.findAll();
    const financialDashboard = await db.FinancialDashboard.findOne({ where: { userId: hookData.u1 } });
    const result = await request(app)
      .get(`/api/v1/affiliate-networks/rakuten/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(result.body.success).to.equal(true);

    const rakutenTransactionsAfter = await db.RakutenTransactions.findAll();
    const financialDashboardAfter = await db.FinancialDashboard.findOne({ where: { userId: hookData.u1 } });
    expect(rakutenTransactionsAfter.length).to.equal(rakutenTransactions.length + 1);
    expect(financialDashboard).to.equal(null);
    expect(financialDashboardAfter?.pending).to.equal(calculateCommission(Math.round(hookData.commissions * 100)));
  });

  it('Should create a new rakuten transaction without a user and mark as zombie', async () => {
    const hookData = rakutenHookResponse(transactionId2, '55');
    const rakutenTransactions = await db.RakutenTransactions.findAll();
    const result = await request(app)
      .get(`/api/v1/affiliate-networks/rakuten/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    const rakutenTransactionsAfter = await db.RakutenTransactions.findAll();

    expect(result.body.success).to.equal(true);
    expect(rakutenTransactionsAfter.length).to.equal(rakutenTransactions.length + 1);
  });

  it('Should create a new rakuten transaction even with the a wrong userId', async () => {
    const hookData = rakutenHookResponse(transactionId3, 'efcg1');
    const rakutenTransactions = await db.RakutenTransactions.findAll();
    const result = await request(app)
      .get(`/api/v1/affiliate-networks/rakuten/webhook`)
      .query(hookData)
      .expect('Content-Type', /json/)
      .expect(200);

    const rakutenTransactionsAfter = await db.RakutenTransactions.findAll();

    expect(result.body.success).to.equal(true);
    expect(rakutenTransactionsAfter.length).to.equal(rakutenTransactions.length + 1);
  });
});
