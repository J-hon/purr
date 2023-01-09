import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../product/entity/category.entity';
import { Product } from '../product/entity/product.entity';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';

@Module({
  // imports: [forwardRef(() => CommonModule)],
  imports: [TypeOrmModule.forFeature([Cart, Product, Category])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
