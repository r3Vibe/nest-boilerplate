import { Global, Module } from '@nestjs/common';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';
import { JwtModule } from './jwt/jwt.module';
import { MailerModule } from './mailer/mailer.module';

@Global()
@Module({
  imports: [CustomLoggerModule, JwtModule, MailerModule],
  exports: [CustomLoggerModule, JwtModule, MailerModule],
})
export class CommonModule {}
