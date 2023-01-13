import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueConfigService {
  constructor(private readonly configService: ConfigService) {}

  async createSharedConfiguration(): Promise<object> {
    return {
      redis: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
      },
    };
  }
}
