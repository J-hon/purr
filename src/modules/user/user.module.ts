import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, MailService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
