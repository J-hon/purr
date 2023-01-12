import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  async createSharedConfiguration(): Promise<BullModuleOptions> {
    return {
      redis: {
        host: this.configService.get<string>('QUEUE_HOST'),
        port: this.configService.get<number>('QUEUE_PORT'),
      },
    };
  }
}
