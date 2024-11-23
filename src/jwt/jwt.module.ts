import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModule as JwtM } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtM.registerAsync({
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
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
