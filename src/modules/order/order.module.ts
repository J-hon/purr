import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/cart.entity';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/user.entity';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';
import { CartService } from '../cart/cart.service';
import { OrderItem } from './entity/order-item.entity';
import { Category } from '../product/entity/category.entity';
import { OrderCreatedListener } from './listeners/order-created.listener';
import { ProductService } from '../product/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, OrderItem, Product, User, Category]),
  ],
  controllers: [OrderController],
  providers: [OrderService, CartService, OrderCreatedListener, ProductService],
  exports: [OrderService],
})
export class OrderModule {}
