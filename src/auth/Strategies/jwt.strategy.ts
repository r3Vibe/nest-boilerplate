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
      jwtSecret: string;
      issuer: string;
      algo: string;
    }>('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      issuer: jwtConfig.issuer,
      algorithms: [jwtConfig.algo],
      secretOrKey: jwtConfig.jwtSecret,
    });
  }

  private static extractJWTFromCookie(req: RequestType): string | null {
    if (req && req.cookies) {
      return req.cookies['access_token'];
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    return { ...user };
  }
}
