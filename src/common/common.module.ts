import { Global, Module } from '@nestjs/common';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';
import { CustomMailerModule } from './custom-mailer/custom-mailer.module';

@Global()
@Module({
  imports: [CustomLoggerModule, CustomMailerModule],
  exports: [CustomLoggerModule, CustomMailerModule],
})
export class CommonModule {}
