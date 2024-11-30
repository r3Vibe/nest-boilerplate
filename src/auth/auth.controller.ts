import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiSchema } from 'src/common/validation/joiSchema.validation';
import { CreateUserValidation } from './auth.validation';
import messages from 'src/common/messages';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @ApiCreatedResponse({
    description: 'New User Created Successfully.',
    type: CreateUserDto,
  })
  @ApiOperation({
    summary: 'Create a new user with Email and Password',
    description: 'Basic Email and Password Based Registration',
  })
  @HttpCode(HttpStatus.CREATED)
  @JoiSchema(CreateUserValidation, 'body')
  @Post('register')
  async registerEmailandPassword(@Body() data: CreateUserDto) {
    // return { message: messages.success };
    const user = await this.authService.registerEmailandPassword(data);

    return {
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
      },
      message: messages.success,
    };
  }

  @ApiOkResponse({
    description: 'Login Successfully.',
    type: LoginUserDto,
  })
  @ApiOperation({
    summary: 'Login with Email and Password',
    description: 'Basic Email and Password Based Login',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginUserDto, @Res({ passthrough: true }) resp) {
    const tokens = await this.authService.login(data);

    resp.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      maxAge: this.config.get<{ accessExpiryHours: string }>('jwt')
        .accessExpiryHours,
      sameSite: 'lax',
      secure:
        this.config.get<string>('NODE_ENV') === 'development' ? false : true,
    });

    resp.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: this.config.get<{ refreshExpiryDays: string }>('jwt')
        .refreshExpiryDays,
      sameSite: 'lax',
      secure:
        this.config.get<string>('NODE_ENV') === 'development' ? false : true,
    });

    return {
      tokens,
      message: messages.success,
    };
  }
}
