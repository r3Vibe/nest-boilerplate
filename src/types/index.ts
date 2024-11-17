import { Types } from 'mongoose';

export type User = {
  _id: Types.ObjectId;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};
