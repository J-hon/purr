import { AgendaModule } from '@agent-ly/nestjs-agenda';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    ProductModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CartModule,
    OrderModule,
    MailModule,
    EventEmitterModule.forRoot(),
    AgendaModule.forRoot({
      db: {
        address: 'mongodb://localhost:27017/super-mart',
        collection: 'jobs',
      },
    }),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
