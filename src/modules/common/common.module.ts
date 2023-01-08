import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/cart.entity';
import { Category } from '../product/entity/category.entity';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User, Category])],
  providers: [],
  exports: [],
})
export class CommonModule {}
