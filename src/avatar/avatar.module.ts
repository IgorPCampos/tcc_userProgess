import { Avatar, AvatarSchema } from './avatar.entity';

import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Avatar.name, schema: AvatarSchema },
    ]),
  ],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
