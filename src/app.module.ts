import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCharacterModule } from './user_character/user_character.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB || ''),
    UserCharacterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
