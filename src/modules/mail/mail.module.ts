import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailerConfigService } from 'src/config/mailer.config';
import { MailService } from './mail.service';
import { MailProcessor } from './processors/mail.processor';

@Global()
@Module({
  imports: [MailerModule.forRootAsync({ useClass: MailerConfigService })],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
