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
