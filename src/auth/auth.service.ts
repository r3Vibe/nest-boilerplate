/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { comparePassword } from 'src/helper/password';
import { IUser } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthFlow, Flow } from './entities/flow.entity';
import { OTP } from './entities/otp.entity';
import { ObjectId, Repository } from 'typeorm';
import { makeToken } from 'src/helper/token';
import { generateSecureOTP } from 'src/helper/otp';
import * as moment from 'moment';
import { ObjectId as MongodbObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(AuthFlow)
    private readonly flowRepository: Repository<AuthFlow>,
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
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

  async login(
    data: any,
  ): Promise<
    | { current_flow: { flow: Flow; flowId: string } }
    | { user: IUser; access_token: string; refresh_token: string }
  > {
    const user = await this.validateUser(data.email, data.password);
    let current_flow = null;

    if (!user) {
      throw new UnauthorizedException();
    }

    const otpNeeded = this.config.get('NEED_OTP_AFTER_LOGIN');
    const otpExpMin = this.config.get('VERIFICATION_OTP_EXPIRY_MINUTES');

    if (otpNeeded) {
      // create the flow
      current_flow = await this.flowRepository.save({
        flow: Flow.OTP,
        userId: user._id,
        token: makeToken(16),
      });

      // save the otp
      await this.otpRepository.save({
        flowId: current_flow._id,
        expiresAt: moment(new Date()).add(otpExpMin, 'minutes').toISOString(),
        code: generateSecureOTP(),
        userId: user._id,
      });

      return {
        current_flow: {
          flow: current_flow.flow,
          flowId: current_flow._id,
        },
      };
    } else {
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

  async getOTPFromFlow(flowId: ObjectId): Promise<OTP> {
    return this.otpRepository.findOne({
      where: {
        flowId: new MongodbObjectId(flowId),
      },
    });
  }
}
