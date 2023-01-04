import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateSku } from 'src/utils/utils';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async get(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findById(id: string): Promise<Product | undefined> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    return product;
  }

  async create(payload: CreateProductDto | any): Promise<Product> {
    payload.sku = generateSku(14);
    return await this.productModel.create(payload);
  }
}
