import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';
import { AgendaService } from '@agent-ly/nestjs-agenda';

@Injectable()
export class OrderCreatedListener {
  constructor(private readonly agendaService: AgendaService) {}

  @OnEvent('order.created')
  handleOrderCreatedEvent(order: OrderCreatedEvent): void {
    this.agendaService.now('Send order mail', { order });
  }
}
