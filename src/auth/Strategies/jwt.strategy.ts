import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request as RequestType } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {
    const jwtConfig = config.get<{
      secret: string;
      issuer: string;
      algorithm: string;
    }>('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      issuer: jwtConfig.issuer,
      algorithms: [jwtConfig.algorithm],
      secretOrKey: jwtConfig.secret,
    });
  }

  private static extractJWTFromCookie(req: RequestType): string | null {
    if (req && req.cookies) {
      return req.cookies['access_token'];
    }
    return null;
  }

  async validate(payload: any) {
    // const user = await this.userService.findOne(payload.sub);
    const user = null;
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...user };
  }
}
