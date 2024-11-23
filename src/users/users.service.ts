import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ObjectId, Repository } from 'typeorm';
import { ObjectId as MongodbObjectId } from 'mongodb';
import { AuthFlow, Flow } from 'src/auth/entities/flow.entity';
import { ConfigService } from '@nestjs/config';
import { OTP } from 'src/auth/entities/otp.entity';
import * as moment from 'moment';
import { JwtService } from 'src/jwt/jwt.service';
import { ITokens } from 'src/types';
import { generateSecureOTP } from 'src/helper/otp';
import { makeToken } from 'src/helper/token';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(AuthFlow)
    private readonly flowRepository: Repository<AuthFlow>,
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<{
    user: User;
    tokens: ITokens;
  }> {
    // check if verification is required after registration
    const verifyMAIL = this.config.get('VERIFY_EMAIL_AFTER_REGISTRATION');
    const otpExpMin = this.config.get('VERIFICATION_OTP_EXPIRY_MINUTES');

    // create the user
    const user = await this.usersRepository.save(createUserDto);
    let tokens: ITokens = null;

    // if verification is required, save the flow and make otp
    if (verifyMAIL) {
      // create the flow
      const flow = await this.flowRepository.save({
        flow: Flow.VALIDATE,
        userId: user._id,
        token: makeToken(16),
      });

      // save the otp
      await this.otpRepository.save({
        flowId: flow._id,
        expiresAt: moment(new Date()).add(otpExpMin, 'minutes').toISOString(),
        code: generateSecureOTP(),
      });
    } else {
      const payload = {
        sub: user._id,
      };

      tokens = await this.jwtService.tokens(payload);
    }

    // return the user
    return { user, tokens };
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: ObjectId): Promise<User> {
    return this.usersRepository.findOneBy({
      _id: new MongodbObjectId(id),
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(new MongodbObjectId(id), updateUserDto);
  }

  async remove(id: ObjectId) {
    return this.usersRepository.delete(new MongodbObjectId(id));
  }
}
