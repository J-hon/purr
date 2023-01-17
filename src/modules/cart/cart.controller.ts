import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TransformInterceptor } from '../common/common.interceptor';
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
    @Request() req: any,
  ): Promise<string> {
    return await this.cartService.add(request, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async get(@Request() req: any): Promise<Cart[]> {
    return await this.cartService.getUserCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('remove')
  async remove(@Body() body: any, @Request() req: any): Promise<any> {
    const { product_id } = body;

    return await this.cartService.removeFromCart(product_id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete()
  async destroy(@Request() req: any): Promise<any> {
    return await this.cartService.emptyCart(req.user.id);
  }
}
