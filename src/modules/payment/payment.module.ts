import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaystackService } from './gateway/paystack/paystack.service';
import { PaymentService } from './payment.service';
import { PaystackWebhookController } from './gateway/paystack/paystack-webhook.controller';
import { PaystackWebhookService } from './gateway/paystack/paystack-webhook.service';

@Module({
  imports: [HttpModule],
  providers: [PaystackService, PaymentService, PaystackWebhookService],
  controllers: [PaymentController, PaystackWebhookController],
  exports: [PaymentService],
})
export class PaymentModule {}
