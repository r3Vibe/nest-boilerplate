import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { makePassword } from 'src/helper/password';

export type userDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  this.password = await makePassword(this.password);
  next();
});
