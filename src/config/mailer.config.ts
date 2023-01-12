import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createMailerOptions(): Promise<MailerOptions> {
    return {
      transport: {
        host: this.configService.get('MAIL_HOST'),
        secure: false,
        port: this.configService.get('MAIL_PORT'),
        auth: {
          user: this.configService.get('MAIL_USER'),
          pass: this.configService.get('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: `"Super Mart" <${this.configService.get('MAIL_FROM')}>`,
      },
      template: {
        dir: join(__dirname, '../modules/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
