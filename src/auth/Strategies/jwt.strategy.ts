import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'asasasasasasasasasas',
    });
  }

  private static extractJWTFromCookie(req: RequestType): string | null {
    if (req && req.cookies) {
      return req.cookies['jwt'];
    }
    return null;
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
