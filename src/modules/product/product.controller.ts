import { Body, Controller, Get, HttpStatus, Param, Post, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async index(): Promise<Product[]> {
    return await this.productService.get();
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<Product | undefined> {
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
