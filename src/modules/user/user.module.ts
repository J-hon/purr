import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MailModule } from '../mail/mail.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'send-welcome-mail',
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
