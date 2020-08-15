export interface RakutenFinalUserPayment {
  userId: string;
  total: number;
  type: string;
}

export interface CommissionsByOrder {
  [key: string]: number;
}

export interface IPaymentByUser {
  [key: string]: number;
}

export interface OrdersGroupedByUser {
  [key: string]: Array<string>;
}

export interface ImpactRadiusPayment {
  userId: string;
  actionId: string;
  status: string;
  statusDetail: string; // 'Paid'
  payout: string;
  originalPayout: string;
  vat: string;
  subId1: string;
  subId2: string;
  subId3: string;
  sharedId: string;
  customerId: string;
}
