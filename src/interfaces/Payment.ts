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
