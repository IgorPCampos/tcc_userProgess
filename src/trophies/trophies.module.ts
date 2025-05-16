import { Trophy, TrophySchema } from './schemas/trophy.schema';
import { UserProgress, UserProgressSchema } from './schemas/user_progress.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrophiesController } from './trophies.controller';
import { TrophyService } from './trophies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trophy.name, schema: TrophySchema },
      { name: UserProgress.name, schema: UserProgressSchema },
    ]),
  ],
  controllers: [TrophiesController],
  providers: [TrophyService],
})
export class TrophiesModule {}
