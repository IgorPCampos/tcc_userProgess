import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserCharacterService } from './user_character.service';
import { CreateUserCharacterDto } from './dto/create-user_character.dto';
import { UpdateUserCharacterDto } from './dto/update-user_character.dto';
import { IUserProgress } from './interface/userProgress.interface';

@Controller('user-character')
export class UserCharacterController {
  constructor(private readonly userCharacterService: UserCharacterService) {}

  @Post()
  create(@Body() createUserCharacterDto: CreateUserCharacterDto) {
    return this.userCharacterService.create(createUserCharacterDto);
  }

  @Get()
  findAll() {
    return this.userCharacterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCharacterService.findOne(id);
  }

  @Post('/complete-activity')
  update(@Body() userProgress: IUserProgress) {
    return this.userCharacterService.updatePointsAndLevel(userProgress);
  }
}
