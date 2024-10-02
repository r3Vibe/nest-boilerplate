import { $Enums } from '@prisma/client';

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};
