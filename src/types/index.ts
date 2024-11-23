import { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}
