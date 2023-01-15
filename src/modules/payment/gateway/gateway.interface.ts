export interface Gateway {
  amount: number;
  email: string;
}

export declare class PaymentGateway {
  initialize(payload: object): Promise<any>;
  verifyTransaction(ref: string): Promise<any>;
}
