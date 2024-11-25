import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { CustomLoggerModule } from 'src/common/custom-logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}