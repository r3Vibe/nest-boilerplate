import { ObjectId } from 'mongodb';
import { AuthFlow } from 'src/auth/entities/flow.entity';
import { User } from 'src/users/entities/user.entity';

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

export interface IResponse {
  user: Partial<User>;
  tokens?: ITokens;
  current_flow?: Partial<AuthFlow>;
}
