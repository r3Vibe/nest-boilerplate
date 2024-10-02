import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/CreateUserDto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateUserDto) {
    return await this.databaseService.user.create({
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id },
    });
  }
}
