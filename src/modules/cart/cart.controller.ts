import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('add')
  async store(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    request: AddToCartDto,
    @Request() req: any,
  ): Promise<string> {
    return await this.cartService.add(request, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('')
  async get(@Request() req: any): Promise<Cart[]> {
    return await this.cartService.getUserCart(req.user.id);
  }
}
