import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { User } from '../../user/user.entity';

@Injectable()
@Processor('send-welcome-mail')
export class SendWelcomeMailProcessor {
  private readonly _logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  public onActive(job: Job): void {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job): void {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any): void {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('send-welcome-mail')
  confirmRegistration(job: Job<{ user: User }>) {
    this._logger.log(
      `Sending confirm registration email to '${job.data.user.email}'`,
    );

    try {
      return this.mailerService.sendMail({
        to: job.data.user.email,
        subject: 'Welcome to Super mart',
        template: 'welcome-mail',
        context: {
          name: job.data.user.name,
        },
      });
    } catch {
      this._logger.error(
        `Failed to send welcome email to '${job.data.user.email}'`,
      );
    }
  }
}
