import {
  Request,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TransformInterceptor } from '../common/common.interceptor';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';

@UseInterceptors(TransformInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async checkout(@Request() req: any): Promise<Order> {
    return await this.orderService.create(req.user.id);
  }
}
