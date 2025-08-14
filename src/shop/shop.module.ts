import { ShopItem, ShopItemSchema } from './shop_item.entity';
import {
  UserCharacter,
  UserCharacterSchema,
} from 'src/user_character/user_character.entity';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopItem.name, schema: ShopItemSchema },
      { name: UserCharacter.name, schema: UserCharacterSchema },
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
