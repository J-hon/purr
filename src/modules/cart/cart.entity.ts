import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'carts' })
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  price: number;

  @Column({ type: 'bigint' })
  quantity: number;

  @Column()
  user_id: number;

  @Column()
  product_id: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.carts)
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;
}
