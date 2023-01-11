import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from '../common/common.interceptor';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';

@UseInterceptors(TransformInterceptor)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  async index(): Promise<Product[]> {
    return await this.productService.get();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async show(@Param('id') id: number): Promise<Product | undefined> {
    return await this.productService.findById(id);
  }

  @Post('')
  async store(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    request: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.create(request);
  }
}
