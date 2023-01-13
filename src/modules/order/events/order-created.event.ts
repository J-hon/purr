import { Order } from '../entity/order.entity';

export class OrderCreatedEvent {
  order: Order;
}
