/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { comparePassword } from 'src/helper/password';
import { IUser } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<IUser | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    if (await comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: any) {
    const user = await this.validateUser(data.email, data.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
    };

    const tokens = await this.jwtService.tokens(payload);

    return {
      ...tokens,
      user,
    };
  }
}
