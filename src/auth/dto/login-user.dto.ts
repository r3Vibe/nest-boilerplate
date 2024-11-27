import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
}
