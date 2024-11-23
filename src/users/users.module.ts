import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './user.subscriber';
import { AuthFlow } from 'src/auth/entities/flow.entity';
import { OTP } from 'src/auth/entities/otp.entity';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthFlow, OTP]), JwtModule],
  controllers: [],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
