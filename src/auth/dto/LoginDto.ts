import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'vW5XU@example.com',
    description: 'Email of the user',
    name: 'email',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'Ps#12354',
    description: 'Password of the user',
    name: 'password',
    required: true,
  })
  @IsString()
  @Length(6, 20)
  password: string;
}
