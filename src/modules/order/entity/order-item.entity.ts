import { Product } from 'src/modules/product/entity/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  product_id: number;

  @Column({ type: 'bigint' })
  price: number;

  @Column({ type: 'bigint' })
  quantity: number;

  @Column({ type: 'bigint' })
  sub_total: number;

  @ManyToOne(() => Product, (product) => product.carts)
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;
}
