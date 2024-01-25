import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Exporting the User model and its types
export type UserDocument = User & Document;