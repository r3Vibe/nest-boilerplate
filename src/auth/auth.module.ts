import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './Strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { GoogleStrategy } from './Strategies/google.strategy';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'asasasasasasasasasas',
    }),
  ],
  providers: [
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    CustomLoggerService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
