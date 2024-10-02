import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    const socialConfig = config.get('social');
    super({
      clientID: socialConfig.google.client_id,
      clientSecret: socialConfig.google.client_secret,
      callbackURL: socialConfig.google.callback,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      ...profile,
    };
    done(null, user as any);
  }
}
