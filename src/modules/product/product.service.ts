import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateSku } from 'src/utils/utils';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async get(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    return product;
  }

  async create(payload: CreateProductDto | any): Promise<Product> {
    const sku = generateSku(14);

    const product: Product = new Product();
    product.name = payload.name;
    product.description = payload.description;
    product.sku = sku;
    product.price = payload.price;
    product.quantity = payload.quantity;

    return await product.save();
  }
}
