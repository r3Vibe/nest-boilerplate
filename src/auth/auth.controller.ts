import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/LoginDto';
import { LoginResponseDto } from './dto/LoginResponseDto';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/users/dto/UserDto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiCreatedResponse({
    description: 'Registration Successful',
    type: UserDto,
  })
  async register(@Body() data: UserDto) {
    return this.userService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({
    description: 'Login Successful',
    type: LoginResponseDto,
  })
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) res) {
    const tokens = await this.authService.login(data);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      maxAge: this.config.get<{ accres_expiry: string }>('jwt').accres_expiry,
      sameSite: 'lax',
      secure:
        this.config.get<string>('NODE_ENV') === 'development' ? false : true,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: this.config.get<{ refresh_expiry: string }>('jwt').refresh_expiry,
      sameSite: 'lax',
      secure:
        this.config.get<string>('NODE_ENV') === 'development' ? false : true,
    });

    return tokens;
  }
}
