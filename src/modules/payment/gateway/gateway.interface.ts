export interface Gateway {
  amount: number;
  email: string;
  order_id: number;
}

export declare class PaymentGateway {
  initialize(payload: object): Promise<any>;
  verifyTransaction(ref: string): Promise<any>;
}
