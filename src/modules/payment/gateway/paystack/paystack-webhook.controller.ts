import {
  Request,
  Controller,
  Post,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaystackWebhookService } from './paystack-webhook.service';

@Controller('paystack')
export class PaystackWebhookController {
  constructor(private readonly webhookService: PaystackWebhookService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('x-paystack-signature') signature: string,
    @Request() request: any,
  ): Promise<void> {
    await this.webhookService.handleWebhookEvent(signature, request.body);
  }
}
