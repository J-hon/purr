import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Product } from '../product/entity/product.entity';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    private readonly cartService: CartService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(userId: number): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const cartItems = await this.cartService.getUserCart(userId);

    this.checkIfProductsAreStillAvailable(cartItems);

    try {
      const createOrder = this.orderRepository.create({
        user_id: userId,
        is_completed: true,
      });

      const order = await queryRunner.manager.save(Order, createOrder);

      const products = cartItems.map((item) => ({
        product_id: item.product_id,
        order_id: order.id,
        price: item.price,
        quantity: item.quantity,
        sub_total: item.price * item.quantity,
      }));

      order.items = this.orderItemRepository.create(products);
      order.total = this.sumOrderTotal(order.items);

      await this.updateStockOfOrderItems(queryRunner.manager, order.items);

      await this.emptyCart(queryRunner.manager, userId);

      await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  private async emptyCart(
    entityManager: EntityManager,
    userId: number,
  ): Promise<void> {
    await entityManager.delete(Cart, { user_id: userId });
  }

  private sumOrderTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc, product): number => {
      return acc + product.sub_total;
    }, 0);
  }

  private async updateStockOfOrderItems(
    entityManager: EntityManager,
    products: OrderItem[],
  ): Promise<void> {
    products.forEach(async (el) => {
      const product = await this.findProduct(el.product_id);

      product.quantity -= el.quantity;
      await entityManager.save(Product, product);
    });
  }

  private async findProduct(id: number): Promise<Product> {
    return await this.productRepository.findOneOrFail({
      where: { id },
    });
  }

  private async checkIfProductsAreStillAvailable(
    products: Cart[],
  ): Promise<void> {
    products.forEach(async (el: Cart) => {
      const product = await this.findProduct(el.product_id);

      const inStock = product.quantity < 1;

      if (inStock) {
        throw new HttpException(product.name + ' is out of stock', 400);
      }

      const quantityAvailable = product.quantity < el.quantity;

      if (quantityAvailable) {
        throw new HttpException(
          product.name + 'has only ' + product.quantity + ' item(s) available',
          400,
        );
      }
    });
  }
}
