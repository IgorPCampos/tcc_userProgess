import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from './avatar.entity';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private avatarModel: Model<Avatar>,
  ) {}

  async create(createAvatarDto: CreateAvatarDto): Promise<Avatar> {
    const createdAvatar = new this.avatarModel(createAvatarDto);
    return createdAvatar.save();
  }

  async findAll(): Promise<Avatar[]> {
    return this.avatarModel.find().exec();
  }

  async findOne(id: string): Promise<Avatar> {
    const Avatar = await this.avatarModel.where({ user_id: id }).findOne();
    if (!Avatar) throw new NotFoundException('Pefil não encontrado');
    return Avatar;
  }

  async update(updateAvatarDto: UpdateAvatarDto): Promise<Avatar> {
    const Avatar = await this.avatarModel
      .where({ user_id: updateAvatarDto.user_id })
      .findOne();
    if (!Avatar) throw new NotFoundException('Pefil não encontrado');
    if (updateAvatarDto.torso) Avatar.torso = updateAvatarDto.torso;
    if (updateAvatarDto.head) Avatar.head = updateAvatarDto.head;
    if (updateAvatarDto.eyes) Avatar.eyes = updateAvatarDto.eyes;
    return Avatar.save();
  }
}
