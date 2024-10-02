import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'vW5XU@example.com',
    description: 'Email of the user',
    name: 'email',
    required: true,
    uniqueItems: true,
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    name: 'first_name',
    required: true,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    name: 'last_name',
    required: true,
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'Ps#12354',
    description: 'Password of the user',
    name: 'password',
    required: true,
  })
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Role of the user',
    name: 'role',
    enum: Role,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role; // Defaults to 'user' if not provided
}
