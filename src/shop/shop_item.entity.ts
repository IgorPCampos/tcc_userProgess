import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'shop_item' })
export class ShopItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  url: string;
}

export const ShopItemSchema = SchemaFactory.createForClass(ShopItem);
