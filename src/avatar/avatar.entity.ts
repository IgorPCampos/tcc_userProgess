import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'avatar' })
export class Avatar extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  torso: string;

  @Prop({ required: true })
  head: string;

  @Prop({ required: false })
  eyes: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
