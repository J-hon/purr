import { Injectable } from '@nestjs/common';
import { Gateway } from './gateway/gateway.interface';
import { PaystackService } from './gateway/paystack/paystack.service';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async charge(payload: Gateway) {
    return await this.paystackService.initialize(payload);
  }
}
