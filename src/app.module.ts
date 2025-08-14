import { AvatarModule } from './avatar/avatar.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopModule } from './shop/shop.module';
import { TrophiesModule } from './trophies/trophies.module';
import { UserCharacterModule } from './user_character/user_character.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB || ''),
    UserCharacterModule,
    TrophiesModule,
    AvatarModule,
    ShopModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
