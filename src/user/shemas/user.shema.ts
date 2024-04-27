import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  USER = 'User',
  ADMIN = 'Admin',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
