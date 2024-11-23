import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './entities/user.entity';
import { makePassword } from 'src/helper/password';
import { ConfigService } from '@nestjs/config';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private readonly config: ConfigService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const verifyMAIL = this.config.get('VERIFY_EMAIL_AFTER_REGISTRATION');
    if (verifyMAIL) {
      event.entity.isActive = false;
    }
    const hashed_pass = await makePassword(event.entity.password);
    event.entity.password = hashed_pass;
  }
}
