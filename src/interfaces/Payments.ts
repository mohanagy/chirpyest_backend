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
    id?: number;
  };
}

export interface ClassifiedResponseByUserIdAttributes {
  [key: string]: any;
}
