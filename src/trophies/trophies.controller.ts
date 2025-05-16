import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTrophyDto } from './dto/create-trophy.dto';
import { TrophyService } from './trophies.service';

@Controller('trophies')
export class TrophiesController {
  constructor(private readonly trophiesService: TrophyService) {}

  @Post()
  async create(@Body() createTrophyDto: CreateTrophyDto) {
    return await this.trophiesService.create(createTrophyDto);
  }

  @Get()
  async findAll() {
    return await this.trophiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.trophiesService.findOne(id);
  }
}
