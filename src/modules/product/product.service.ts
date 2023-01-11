import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: ['categories'],
    });
  }

  async create(payload: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(payload);

    product.sku = generateSku(14);

    const categories = await this.categoryRepository.findBy({
      id: In(payload.categoryIds),
    });

    product.categories = categories;

    await this.productRepository.save(product);

    return product;
  }
}
