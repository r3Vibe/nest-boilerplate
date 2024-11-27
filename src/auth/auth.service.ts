import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { comparePassword } from 'src/common/helper/password';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    if (!user.isActive) return null;

    if (await comparePassword(pass, user.password)) {
      const result = { ...user };
      delete result.password;
      return result;
    }

    return null;
  }

  async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);

    if (!user) throw new UnauthorizedException();

    const payload = {
      sub: String(user._id),
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: `${this.config.get<{ accessExpiryHours: string }>('jwt').accessExpiryHours}h`,
        audience: 'access',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: `${this.config.get<{ refreshExpiryDays: string }>('jwt').refreshExpiryDays}d`,
        audience: 'refresh',
      }),
      user,
    };
  }

  async registerEmailandPassword(data: CreateUserDto) {
    return this.usersService.registerEmailandPassword(data);
  }
}
