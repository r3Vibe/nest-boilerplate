import { Injectable } from '@nestjs/common';
import { ObjectId } from 'typeorm';
import { JwtService as Jwt } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: Jwt,
    private readonly config: ConfigService,
  ) {}
  async tokens(payload: { sub: ObjectId }) {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: `${this.config.get<{ accres_expiry: string }>('jwt').accres_expiry}h`,
        audience: 'access',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: `${this.config.get<{ refres_expiry: string }>('jwt').refres_expiry}d`,
        audience: 'refresh',
      }),
    };
  }
}
