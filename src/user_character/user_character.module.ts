import { UserCharacter, UserCharacterSchema } from './user_character.entity';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCharacterController } from './user_character.controller';
import { UserCharacterService } from './user_character.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCharacter.name, schema: UserCharacterSchema },
    ]),
  ],
  controllers: [UserCharacterController],
  providers: [UserCharacterService],
})
export class UserCharacterModule {}
