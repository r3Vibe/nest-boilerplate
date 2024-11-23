import { ApiProperty } from '@nestjs/swagger';

export class LoginUserByEmailPassDto {
  @ApiProperty({
    example: 'vW5XU@example.com',
    nullable: false,
    title: 'Email',
    type: 'string',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'Ps#12354',
    nullable: false,
    title: 'Password',
    type: 'string',
    description: 'Password of the user',
  })
  password: string;
}
