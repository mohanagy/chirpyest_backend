export interface PaymentsAttributes {
  id?: number;
  userId: number;
  paypalAccount: string;
  closedOut: number;
  status?: string;
  transactionId?: string;
  payoutBatchId?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface PaymentsTransactionsAttributes {
  id?: number;
  userId?: number;
  paymentId?: number;
  type: string;
  payPalAccount: string;
  amount: number;
  status: string;
}

export interface PayoutsRequestAttributes {
  sender_batch_header: {
    sender_batch_id: string;
    email_subject: string;
    email_message: string;
  };
  items: {
    recipient_type: string;
    amount: {
      value: number;
      currency: string;
    };
    receiver: string;
    sender_item_id: string;
  }[];
}

export interface PayoutsBatchIdsAttributes {
  [key: string]: {
    closedOut: number;
  };
}

export interface ClassifiedResponseByUserIdAttributes {
  [key: string]: any;
}

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
