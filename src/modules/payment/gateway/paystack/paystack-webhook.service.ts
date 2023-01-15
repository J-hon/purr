import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/modules/order/entity/order.entity';
import { JSONValue } from 'src/modules/common/json.type';
import * as crypto from 'crypto';

@Injectable()
export class PaystackWebhookService {
  constructor(
    private configService: ConfigService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async handleWebhookEvent(
    signature: string,
    payload: JSONValue,
  ): Promise<void> {
    const event = this.hydratePayload(signature, payload);

    if (event.event == 'charge.success') {
      this.orderRepository.update(Number(event.data.metadata.order_id), {
        is_completed: true,
      });

      // send user order completed and confirmed mail
    }
  }

  private hydratePayload(signature: string, payload: JSONValue): any {
    const secret = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== hash) {
      throw new Error('Error validating Paystack event');
    }

    return payload;
  }
}
