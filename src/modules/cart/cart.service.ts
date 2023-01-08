import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { Cart } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

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
      throw new NotFoundException("Product doesn't exist");
    }

    const cartItem = (await this.getUserCart(userId)).filter(
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

  async removeFromCart(productId: number, userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cart) {
      throw new HttpException("Item doesn't exist in your cart", 400);
    }

    await this.cartRepository.delete(cart.id);
  }
}
