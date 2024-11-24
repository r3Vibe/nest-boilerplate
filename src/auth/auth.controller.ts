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
    // create the user
    const userData = await this.userService.create(data);

    // if user has tokens set them in the cookie
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

    // retutn the user data
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
    const tokens_or_flow = await this.authService.login(data);

    if ('current_flow' in tokens_or_flow) {
      return tokens_or_flow.current_flow;
    } else {
      res.cookie('access_token', tokens_or_flow.access_token, {
        httpOnly: true,
        maxAge: this.config.get<{ accres_expiry: string }>('jwt').accres_expiry,
        sameSite: 'lax',
        secure:
          this.config.get<string>('NODE_ENV') === 'development' ? false : true,
      });

      res.cookie('refresh_token', tokens_or_flow.refresh_token, {
        httpOnly: true,
        maxAge: this.config.get<{ refresh_expiry: string }>('jwt')
          .refresh_expiry,
        sameSite: 'lax',
        secure:
          this.config.get<string>('NODE_ENV') === 'development' ? false : true,
      });

      return tokens_or_flow;
    }
  }
}
