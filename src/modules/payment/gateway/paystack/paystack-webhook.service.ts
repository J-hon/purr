import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSONValue } from 'src/modules/common/json.type';
import * as crypto from 'crypto';

@Injectable()
export class PaystackWebhookService {
  constructor(private configService: ConfigService) {}

  async handleWebhookEvent(signature: string, payload: JSONValue) {
    const event = this.hydratePayload(signature, payload);

    console.log(event);
  }

  private hydratePayload(signature: string, payload: JSONValue): JSONValue {
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
