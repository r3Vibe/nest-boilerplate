/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/LoginDto';
import { User } from 'src/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: `${this.config.get<{ accres_expiry: string }>('jwt').accres_expiry}h`,
        audience: 'access',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: `${this.config.get<{ refres_expiry: string }>('jwt').refres_expiry}d`,
        audience: 'refresh',
      }),
      user,
    };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
