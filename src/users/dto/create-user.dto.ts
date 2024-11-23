import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    nullable: false,
    title: 'First Name',
    type: 'string',
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    nullable: false,
    title: 'Last Name',
    type: 'string',
  })
  last_name: string;

  @ApiProperty({
    example: 'vW5XU@example.com',
    nullable: false,
    title: 'Email',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    example: '1234567890',
    nullable: true,
    title: 'Phone',
    default: null,
    type: 'string',
  })
  phone: string;
}
