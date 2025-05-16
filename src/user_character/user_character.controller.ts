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
import { IUserProgress } from './interface/userProgress.interface';

@Controller('user-character')
export class UserCharacterController {
  constructor(private readonly userCharacterService: UserCharacterService) {}

  @Post()
  async create(@Body() createUserCharacterDto: CreateUserCharacterDto) {
    return await this.userCharacterService.create(createUserCharacterDto);
  }

  @Get()
  async findAll() {
    return await this.userCharacterService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userCharacterService.findOne(id);
  }

  @Post('/complete-activity')
  async update(@Body() userProgress: IUserProgress) {
    return await this.userCharacterService.updatePointsAndLevel(userProgress);
  }
}
