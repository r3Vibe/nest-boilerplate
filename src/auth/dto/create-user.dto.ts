import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  last_name: string;

  @ApiProperty({
    description: 'Email of the user',
    uniqueItems: true,
    required: false,
    example: 'o5N7S@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Password for the user',
    required: false,
    example: 'Ps#12354',
  })
  password?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
    example: '9506714969',
  })
  phone?: string;
}
