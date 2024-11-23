import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    nullable: false,
    title: 'First Name',
    type: 'string',
    description: 'First name of the user',
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    nullable: false,
    title: 'Last Name',
    type: 'string',
    description: 'Last name of the user',
  })
  last_name: string;

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

  @ApiProperty({
    example: '9506714898',
    nullable: true,
    title: 'Phone',
    default: null,
    type: 'string',
    description: 'Phone number of the user',
  })
  phone: string;
}
