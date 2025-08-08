import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCharacter } from './user_character.entity';
import { CreateUserCharacterDto } from './dto/create-user_character.dto';
import { IUserProgress } from './interface/userProgress.interface';
import { TrophyService } from 'src/trophies/trophies.service';

export const LEVEL_THRESHOLDS = [
  { level: 1, points: 0 },
  { level: 2, points: 100 },
  { level: 3, points: 250 },
  { level: 4, points: 500 },
  { level: 5, points: 1000 },
  { level: 6, points: 1500 },
  { level: 7, points: 2000 },
];

@Injectable()
export class UserCharacterService {
  private readonly logger = new Logger(UserCharacterService.name);

  public constructor(
    @InjectModel(UserCharacter.name)
    private userCharacterModel: Model<UserCharacter>,
    private trophyService: TrophyService,
  ) {}

  public async create(
    createUserCharacterDto: CreateUserCharacterDto,
  ): Promise<UserCharacter> {
    this.logger.log(
      `Creating user character for user ID: ${createUserCharacterDto.user_id}`,
    );
    try {
      const createdUserCharacter = new this.userCharacterModel(
        createUserCharacterDto,
      );
      return await createdUserCharacter.save();
    } catch (error) {
      this.logger.error(
        `Failed to create user character for user ID: ${createUserCharacterDto.user_id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred while creating the user character.',
      );
    }
  }

  public async findAll(): Promise<UserCharacter[]> {
    this.logger.log('Finding all user characters.');
    try {
      return this.userCharacterModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to find all user characters.', error.stack);
      throw new InternalServerErrorException(
        'A failure occurred while retrieving user characters.',
      );
    }
  }

  public async findOne(id: string): Promise<UserCharacter> {
    this.logger.log(`Finding user character with ID: ${id}`);
    try {
      const userCharacter = await this.userCharacterModel.findById(id).exec();
      if (!userCharacter) {
        throw new NotFoundException(
          `User character with ID "${id}" not found.`,
        );
      }
      return userCharacter;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find user character with ID: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred while retrieving the user character.',
      );
    }
  }

  public async updatePointsAndLevel(
    userProgress: IUserProgress,
  ): Promise<UserCharacter[]> {
    const userId = userProgress.user_id;
    this.logger.log(`Updating points and level for user: ${userId}`);
    try {
      const userChar = await this.userCharacterModel
        .findOne({ user_id: userId })
        .exec();
      this.logger.log(`Updating points and level for user: ${userId}`);

      if (!userChar) {
        throw new NotFoundException(
          `Character for user ID "${userId}" not found to update.`,
        );
      }

      const newPoints = (userProgress?.points || 0) + userChar.points;
      userChar.points = newPoints;
      userChar.coins = (userProgress?.coins || 0) + userChar.coins;

      const determinedLevel = LEVEL_THRESHOLDS.slice()
        .reverse()
        .find((t) => newPoints >= t.points);
      const newLevel = determinedLevel ? determinedLevel.level : 1;

      if (newLevel > userChar.level) {
        this.logger.log(
          `User ${userId} leveled up! From ${userChar.level} to ${newLevel}`,
        );
        userChar.level = newLevel;
      }

      await this.trophyService.assignTrophy(userProgress, userChar);
      await userChar.save();

      return [userChar];
    } catch (error) {
      this.logger.error(
        `Failed to update points and level for user: ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred during the update process.',
      );
    }
  }

  public async getStats(user_id: string): Promise<any> {
    this.logger.log(`Getting stats for user ID: ${user_id}`);
    try {
      const userChar = await this.userCharacterModel
        .findOne({ user_id: user_id })
        .exec();
      if (!userChar) {
        throw new NotFoundException(
          `Character for user ID "${user_id}" not found.`,
        );
      }

      const trophies = await this.trophyService.findAll();
      const userTrophyList = trophies.filter((t) =>
        userChar.trophies.includes(t._id.toString()),
      );

      return {
        level: userChar.level,
        points: userChar.points,
        trophies: userTrophyList,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get stats for user ID: ${user_id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred while retrieving user stats.',
      );
    }
  }
}
