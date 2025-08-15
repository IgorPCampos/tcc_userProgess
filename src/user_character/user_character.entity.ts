import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'user_character' })
export class UserCharacter extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  points: number;

  @Prop({ required: false })
  coins: number;

  @Prop({ required: false })
  avatar_id?: string;

  @Prop({ required: true })
  rank: string;

  @Prop({ required: false })
  trophies: string[];

  @Prop({ required: false })
  items: string[];
}

export const UserCharacterSchema = SchemaFactory.createForClass(UserCharacter);
