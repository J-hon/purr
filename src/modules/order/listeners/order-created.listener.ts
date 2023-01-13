import Agenda, { Job } from 'agenda';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('order.created')
  handleOrderCreatedEvent(_event: OrderCreatedEvent) {
    const agenda = new Agenda({
      db: {
        address: 'mongodb://localhost:27017/super-mart',
        collection: 'jobs',
      },
    });

    // agenda.now('registration email', { event: OrderCreatedEvent });

    // agenda.define('log hello medium', async (job: Job) => {
    //   const { name } = job.attrs;

    //   console.log(name);
    // });

    // (async function () {
    //   await agenda.start(); // Start Agenda instance

    //   await agenda.schedule('in 5 seconds', 'log hello medium', {
    //     name: 'Medium',
    //   });
    // })();

    console.log(agenda);
  }
}
