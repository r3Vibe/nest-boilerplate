import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserByEmailPassDto } from 'src/users/dto/loginbyemail.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateUserValidation } from 'src/users/validation/user.validation';
import { JoiSchema } from 'src/validation/joiSchema.validation';
import { UsersService } from 'src/users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @JoiSchema(CreateUserValidation, 'body')
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserDto,
  })
  async register(@Body() data: CreateUserDto, @Res({ passthrough: true }) res) {
    const userData = await this.userService.create(data);
    if (userData.tokens) {
      res.cookie('access_token', userData.tokens.access_token, {
        httpOnly: true,
        maxAge: this.config.get<{ accres_expiry: string }>('jwt').accres_expiry,
        sameSite: 'lax',
        secure:
          this.config.get<string>('NODE_ENV') === 'development' ? false : true,
      });

      res.cookie('refresh_token', userData.tokens.refresh_token, {
        httpOnly: true,
        maxAge: this.config.get<{ refresh_expiry: string }>('jwt')
          .refresh_expiry,
        sameSite: 'lax',
        secure:
          this.config.get<string>('NODE_ENV') === 'development' ? false : true,
      });
    }
    return userData;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-by-email-password')
  @ApiOkResponse({
    description: 'Login Successful',
    type: LoginUserByEmailPassDto,
  })
  async login(
    @Body() data: LoginUserByEmailPassDto,
    @Res({ passthrough: true }) res,
  ) {
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
