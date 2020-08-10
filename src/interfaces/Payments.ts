export interface PaymentsAttributes {
  id?: number;
  userId: number;
  paypalAccount: string;
  closedOut: number;
  status?: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
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
