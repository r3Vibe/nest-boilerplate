import { Module } from '@nestjs/common';
import { CustomMailerService } from './custom-mailer.service';

@Module({
  providers: [CustomMailerService],
  exports: [CustomMailerService],
})
export class CustomMailerModule {}
