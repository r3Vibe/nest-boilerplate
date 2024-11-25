import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { Session } from './entities/session.entity';
import { MagicLink } from './entities/magic-link.entity';
import { Token } from './entities/token.entity';
import { AuthFlow } from './entities/flow.entity';
import { OTPSubscriber } from './otp.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([OTP, Session, MagicLink, Token, AuthFlow]),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OTPSubscriber],
  exports: [AuthService],
})
export class AuthModule {}
