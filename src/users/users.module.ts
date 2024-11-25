import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './user.subscriber';
import { AuthFlow } from 'src/auth/entities/flow.entity';
import { OTP } from 'src/auth/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthFlow, OTP])],
  controllers: [],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
