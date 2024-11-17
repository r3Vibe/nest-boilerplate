import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/UserDto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: UserDto) {
    const user = (await this.userModel.create(data)).toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return (await this.userModel.findOne({ email })).toJSON();
  }

  async findById(id: number) {
    return (await this.userModel.findById(id)).toJSON();
  }
}
