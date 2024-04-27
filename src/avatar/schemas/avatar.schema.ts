import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Avatar {
  @Prop()
  userId: string;

  @Prop()
  base64: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
