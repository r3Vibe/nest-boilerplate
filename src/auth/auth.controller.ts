import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './Guards/local.guard';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'New User Created Successfully.',
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @ApiOperation({
    summary: 'Create a new user with Email and Password',
    description: 'Basic Email and Password Based Registration',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register-email-password')
  async registerEmail() {}
}
