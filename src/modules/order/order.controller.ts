import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { RequestUser } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TransformInterceptor } from '../common/common.interceptor';
import { User } from '../user/user.entity';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';

@UseInterceptors(TransformInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async checkout(@RequestUser() user: User): Promise<Order> {
    return await this.orderService.create(user.id);
  }
}
