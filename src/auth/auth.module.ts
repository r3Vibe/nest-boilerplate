import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { GoogleStrategy } from './Strategies/google.strategy';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<{ jwtSecret: string }>('jwt')?.jwtSecret,
        signOptions: {
          algorithm: config.get<{ algo: string }>('jwt')?.algo as any,
          issuer: config.get<{ issuer: string }>('jwt')?.issuer,
        },
        verifyOptions: {
          algorithms: [config.get<{ algo: string }>('jwt')?.algo as any],
          issuer: config.get<{ issuer: string }>('jwt')?.issuer,
        },
      }),
    }),
  ],
  providers: [
    UsersService,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    CustomLoggerService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
