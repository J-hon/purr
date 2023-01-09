import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entity/product.entity';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(userId: number): Promise<Order> {
    const carts = await this.cartService.getUserCart(userId);

    this.checkProduct(carts);

    const payload = this.orderRepository.create({
      user_id: userId,
      is_completed: true,
    });

    const order = await this.orderRepository.save(payload);

    const products = carts.map((cart) => ({
      product_id: cart.product_id,
      order_id: order.id,
      price: cart.price,
      quantity: cart.quantity,
      sub_total: cart.price * cart.quantity,
    }));

    order.items = this.orderItemRepository.create(products);
    order.total = products.reduce((acc, product) => {
      return acc + product.sub_total;
    }, 0);

    await this.orderRepository.save(order);

    this.cartService.emptyCart(userId);

    await this.updateProductQuantity(order.items);

    return order;
  }

  private async checkProduct(products: Cart[]) {
    products.forEach(async (element: Cart) => {
      let product = await this.productService.findById(element.product_id);

      if (product) {
        let inStock = product.quantity < 1;

        if (inStock) {
          throw new HttpException('Out of stock', 400);
        }

        let quantityAvailable = product.quantity < element.quantity;

        if (quantityAvailable) {
          throw new HttpException(
            'Only ' + product.quantity + ' item(s) are available',
            400,
          );
        }
      }
    });
  }

  private async updateProductQuantity(products: OrderItem[]): Promise<void> {
    products.forEach(async (el) => {
      let product = await this.productService.findById(el.product_id);

      if (product) {
        product.quantity -= el.quantity;
        this.productRepository.save(product);
      }
    });
  }
}
