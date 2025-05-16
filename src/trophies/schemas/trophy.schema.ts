import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Conditions {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  value: number;
}

export const ConditionsSchema = SchemaFactory.createForClass(Conditions);

@Schema({ timestamps: true, collection: 'trophies' })
export class Trophy extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: ConditionsSchema, required: true })
  conditions: Conditions;
}

export const TrophySchema = SchemaFactory.createForClass(Trophy);
