import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/user.entity';
import { Cart } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getUserCart(userId: number): Promise<Cart[]> {
    return await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async add(payload: AddToCartDto, userId: number): Promise<string> {
    const product = await this.productRepository.findOne({
      where: { id: payload.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    const cartItems = this.getUserCart(userId);

    const cartItem = (await cartItems).filter(
      (item: any): boolean => Number(item.product_id) === product.id,
    );

    if (cartItem.length >= 1) {
      throw new HttpException('Item already exists in your cart', 400);
    }

    const newItem = this.cartRepository.create({
      price: Number(product.price),
      quantity: payload.quantity,
      user_id: userId,
      product_id: product.id,
    });

    await this.cartRepository.save(newItem);

    return 'Item added to cart';
  }
}
