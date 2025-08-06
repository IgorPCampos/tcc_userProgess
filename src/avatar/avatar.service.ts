import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from './avatar.entity';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  public constructor(
    @InjectModel(Avatar.name)
    private avatarModel: Model<Avatar>,
  ) {}

  public async create(createAvatarDto: CreateAvatarDto): Promise<Avatar> {
    this.logger.log(`Creating avatar for user ID: ${createAvatarDto.user_id}`);
    try {
      const createdAvatar = new this.avatarModel(createAvatarDto);
      return await createdAvatar.save();
    } catch (error) {
      this.logger.error(
        `Failed to create avatar for user ID: ${createAvatarDto.user_id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred while creating the avatar.',
      );
    }
  }

  public async findAll(): Promise<Avatar[]> {
    this.logger.log('Finding all avatars.');
    try {
      return this.avatarModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to find all avatars.', error.stack);
      throw new InternalServerErrorException(
        'A failure occurred while retrieving avatars.',
      );
    }
  }

  public async findOne(id: string): Promise<Avatar> {
    this.logger.log(`Finding avatar by user ID: ${id}`);
    try {
      const avatar = await this.avatarModel.findOne({ user_id: id }).exec();
      if (!avatar) {
        throw new NotFoundException(`Avatar for user ID "${id}" not found.`);
      }
      return avatar;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find avatar for user ID: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred while retrieving the avatar.',
      );
    }
  }

  public async update(updateAvatarDto: UpdateAvatarDto): Promise<Avatar> {
    const { user_id } = updateAvatarDto;
    this.logger.log(`Updating avatar for user ID: ${user_id}`);
    try {
      const avatar = await this.avatarModel.findOne({ user_id }).exec();
      if (!avatar) {
        throw new NotFoundException(
          `Avatar for user ID "${user_id}" not found to update.`,
        );
      }
      if (updateAvatarDto.torso) avatar.torso = updateAvatarDto.torso;
      if (updateAvatarDto.head) avatar.head = updateAvatarDto.head;
      if (updateAvatarDto.eyes) avatar.eyes = updateAvatarDto.eyes;
      return await avatar.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update avatar for user ID: ${user_id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred while updating the avatar.',
      );
    }
  }
}
