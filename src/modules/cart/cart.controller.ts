import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { RequestUser } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TransformInterceptor } from '../common/common.interceptor';
import { User } from '../user/user.entity';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@UseInterceptors(TransformInterceptor)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('add')
  async store(
    @Body(new ValidationPipe())
    request: AddToCartDto,
    @RequestUser() user: User,
  ): Promise<string> {
    return await this.cartService.add(request, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async get(@RequestUser() user: User): Promise<Cart[]> {
    return await this.cartService.getUserCart(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('remove')
  async remove(@Body() body: any, @RequestUser() user: User): Promise<any> {
    const { product_id } = body;

    return await this.cartService.removeFromCart(product_id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete()
  async destroy(@RequestUser() user: User): Promise<any> {
    return await this.cartService.emptyCart(user.id);
  }
}
