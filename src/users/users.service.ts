import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ObjectId, Repository } from 'typeorm';
import { ObjectId as MongodbObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: ObjectId): Promise<User> {
    return this.usersRepository.findOneBy({
      _id: new MongodbObjectId(id),
    });
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(new MongodbObjectId(id), updateUserDto);
  }

  async remove(id: ObjectId) {
    return this.usersRepository.delete(new MongodbObjectId(id));
  }
}
