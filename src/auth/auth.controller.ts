import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiSchema } from 'src/common/validation/joiSchema.validation';
import { CreateUserEmailPassValidation } from './auth.validation';
import messages from 'src/common/messages';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'New User Created Successfully.',
    type: CreateUserDto,
  })
  @ApiOperation({
    summary: 'Create a new user with Email and Password',
    description: 'Basic Email and Password Based Registration',
  })
  @HttpCode(HttpStatus.CREATED)
  @JoiSchema(CreateUserEmailPassValidation, 'body')
  @Post('register')
  async registerEmailandPassword(@Body() data: CreateUserDto) {
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
  async login(@Body() data: LoginUserDto) {
    this.authService.login(data);

    return {
      messages: messages.success,
    };
  }
}
