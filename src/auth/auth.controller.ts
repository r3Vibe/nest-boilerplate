import {
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Res,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './Guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';
import { Response } from 'express';
import { GoogleAuthGuard } from './Guards/google-auth.guard';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: CustomLoggerService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.login(req.user);

    response.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: 'lax',
    });

    return {
      jwt: access_token,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  @Get('test')
  async test() {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  @Get('callback/google')
  async test2(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
