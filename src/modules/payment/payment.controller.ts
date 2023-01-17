import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentDto } from './gateway/dto/payment.order';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async pay(
    @Body(new ValidationPipe())
    request: PaymentDto,
  ): Promise<any> {
    return await this.paymentService.charge(request);
  }
}
