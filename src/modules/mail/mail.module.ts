import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailerConfigService } from 'src/config/mailer.config';
import { BullModule } from '@nestjs/bull';
import { SendWelcomeMailProcessor } from './processors/send-welcome-mail.processor';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    BullModule.registerQueue({
      name: 'send-welcome-mail',
    }),
  ],
  providers: [SendWelcomeMailProcessor],
})
export class MailModule {}
