import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarService } from './avatar.service';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post()
  async create(@Body() createAvatarDto: CreateAvatarDto) {
    return await this.avatarService.create(createAvatarDto);
  }

  @Get()
  async findAll() {
    return await this.avatarService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.avatarService.findOne(id);
  }

  @Patch()
  async update(@Body() updateAvatarDto: CreateAvatarDto) {
    return await this.avatarService.update(updateAvatarDto);
  }
}
