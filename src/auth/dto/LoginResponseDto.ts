import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/types';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg',
    description: 'Access token',
    name: 'access_token',
  })
  access_token: string;
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.VFb0qJ1LRg_4ujbZoRMXnVkUgiuKq5KxWqNdbKq_G9Vvz-S1zZa9LPxtHWKa64zDl2ofkT8F6jBt_K4riU-fPg',
    description: 'Refresh token',
    name: 'refresh_token',
  })
  refresh_token: string;
  @ApiProperty({
    example: {
      id: 1,
      email: 'vW5XU@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'USER',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    },
    description: 'User Details',
    name: 'user',
  })
  user: User;
}
