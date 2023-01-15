import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway, Gateway } from '../gateway.interface';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class PaystackService implements PaymentGateway {
  private baseUrl: string;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = 'https://api.paystack.co';
  }

  async initialize(payload: Gateway): Promise<any> {
    return this.httpService
      .post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email: payload.email,
          amount: payload.amount * 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get<string>(
              'PAYSTACK_SECRET_KEY',
            )}`,
          },
        },
      )
      .pipe(map((response) => response.data));
  }

  async verifyTransaction(ref: string): Promise<any> {
    return this.httpService
      .get(`${this.baseUrl}/transaction/verify/${ref}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.configService.get<string>(
            'PAYSTACK_SECRET_KEY',
          )}`,
        },
      })
      .pipe(map((response) => response.data));
  }
}
