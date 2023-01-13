import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendWelcomeMail(user: User): void {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Super Mart!',
      template: 'welcome-mail',
      context: {
        name: user.name,
      },
    });
  }

  sendOrderMail(job: any): void {
    this.mailerService.sendMail({
      to: 'johndoe@example.com',
      subject: 'Order confirmed!',
      template: 'order-confirmed-mail',
      context: {
        name: 'John Doe',
        order_id: job.order.order.id,
      },
    });
  }
}
