import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateSku } from 'src/utils/utils';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async get(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['categories'],
    });
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    return product;
  }

  async create(payload: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(payload);

    product.sku = generateSku(14);

    const categories = await this.categoryRepository.findByIds(
      payload.categoryIds,
    );

    product.categories = categories;

    await this.productRepository.save(product);

    return product;
  }
}
