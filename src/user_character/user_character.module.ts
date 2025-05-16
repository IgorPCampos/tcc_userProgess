import { Trophy, TrophySchema } from 'src/trophies/schemas/trophy.schema';
import { UserCharacter, UserCharacterSchema } from './user_character.entity';
import { UserProgress, UserProgressSchema } from 'src/trophies/schemas/user_progress.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrophyService } from 'src/trophies/trophies.service';
import { UserCharacterController } from './user_character.controller';
import { UserCharacterService } from './user_character.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCharacter.name, schema: UserCharacterSchema },
      { name: Trophy.name, schema: TrophySchema },
      { name: UserProgress.name, schema: UserProgressSchema },
    ]),
  ],
  controllers: [UserCharacterController],
  providers: [UserCharacterService, TrophyService],
})
export class UserCharacterModule {}
