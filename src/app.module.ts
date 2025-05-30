import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCharacterModule } from './user_character/user_character.module';
import { TrophiesModule } from './trophies/trophies.module';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB || ''),
    UserCharacterModule,
    TrophiesModule,
    AvatarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
