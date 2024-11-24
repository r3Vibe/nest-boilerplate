import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OTP } from './entities/otp.entity';
import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';

@EventSubscriber()
export class OTPSubscriber implements EntitySubscriberInterface<OTP> {
  constructor(
    dataSource: DataSource,
    private readonly config: ConfigService,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return OTP;
  }

  async afterInsert(event: InsertEvent<OTP>) {
    const user = await this.userService.findOne(event.entity.userId);
    await this.mailerService.sendMails(user.email, 'OTP', 'otp_verification', {
      otp: event.entity.code,
    });
  }
}
