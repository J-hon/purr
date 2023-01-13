import { Processor, Define } from '@agent-ly/nestjs-agenda';
import { Order } from 'src/modules/order/entity/order.entity';
import { MailService } from '../mail.service';
import { Job } from 'agenda';

@Processor()
export class MailProcessor {
  constructor(private mailService: MailService) {}

  @Define('Send order mail')
  sendOrderMail(job: Job<Order>): void {
    this.mailService.sendOrderMail(job.attrs.data);
  }
}
