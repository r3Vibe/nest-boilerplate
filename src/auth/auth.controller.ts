import {
  Body,
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
import { JoiSchema } from 'src/common/validation/joiSchema.validation';
import { CreateUserEmailPassValidation } from './auth.validation';

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
  @JoiSchema(CreateUserEmailPassValidation, 'body')
  @Post('register-email-password')
  async registerEmailandPassword(@Body() data: CreateUserDto) {
    return this.authService.registerEmailandPassword(data);
  }
}
