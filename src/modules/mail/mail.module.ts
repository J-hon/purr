import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailerConfigService } from 'src/config/mailer.config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [MailerModule.forRootAsync({ useClass: MailerConfigService })],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
