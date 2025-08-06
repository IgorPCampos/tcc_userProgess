import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trophy } from './schemas/trophy.schema';
import { CreateTrophyDto } from './dto/create-trophy.dto';
import { UserCharacter } from 'src/user_character/user_character.entity';
import { IUserProgress } from 'src/user_character/interface/userProgress.interface';
import { UserProgress } from './schemas/user_progress.schema';

@Injectable()
export class TrophyService {
  private readonly logger = new Logger(TrophyService.name);

  public constructor(
    @InjectModel(Trophy.name)
    private trophyModel: Model<Trophy>,
    @InjectModel(UserProgress.name)
    private userProgressModel: Model<UserProgress>,
  ) {}

  public async create(createTrophyDto: CreateTrophyDto): Promise<Trophy> {
    this.logger.log(`Creating trophy with name: "${createTrophyDto.name}"`);
    try {
      const createdTrophy = new this.trophyModel(createTrophyDto);
      return await createdTrophy.save();
    } catch (error) {
      this.logger.error(`Failed to create trophy.`, error.stack);
      throw new InternalServerErrorException(
        'A failure occurred while creating the trophy.',
      );
    }
  }

  public async findAll(): Promise<Trophy[]> {
    this.logger.log('Finding all trophies.');
    try {
      return this.trophyModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to find all trophies.', error.stack);
      throw new InternalServerErrorException(
        'A failure occurred while retrieving trophies.',
      );
    }
  }

  public async findOne(id: string): Promise<Trophy> {
    this.logger.log(`Finding trophy with ID: ${id}`);
    try {
      const trophy = await this.trophyModel.findById(id).exec();
      if (!trophy) {
        throw new NotFoundException(`Trophy with ID "${id}" not found.`);
      }
      return trophy;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find trophy with ID: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'A failure occurred while retrieving the trophy.',
      );
    }
  }

  public async assignTrophy(
    userProgress: IUserProgress,
    userCharacter: UserCharacter,
  ): Promise<Trophy[]> {
    this.logger.log(
      `Checking and assigning trophies for user: ${userProgress.user_id}`,
    );
    try {
      const newTrophies: Trophy[] = [];
      const allTrophies = await this.findAll();
      const ownedTrophyIds = new Set(
        userCharacter.trophies.map((t) => t.toString()),
      );

      const tryAddTrophy = (trophy: Trophy) => {
        if (!ownedTrophyIds.has(trophy._id.toString())) {
          userCharacter.trophies.push(trophy._id.toString());
          ownedTrophyIds.add(trophy._id.toString());
          newTrophies.push(trophy);
        }
      };

      const levelTrophies = allTrophies.filter(
        (t) => t.conditions.type === 'LEVEL',
      );
      for (const trophy of levelTrophies) {
        if (trophy.conditions.value <= userCharacter.level) {
          tryAddTrophy(trophy);
        }
      }

      if (['LESSON', 'EXERCISE', 'SCHOOL_WORK'].includes(userProgress.type)) {
        const userProgresses = await this.userProgressModel
          .find({
            user_id: userProgress.user_id,
            type: userProgress.type,
          })
          .exec();

        const progressTrophies = allTrophies.filter(
          (t) => t.conditions.type === userProgress.type,
        );

        for (const trophy of progressTrophies) {
          if (trophy.conditions.value <= userProgresses.length) {
            tryAddTrophy(trophy);
          }
        }
      }

      if (newTrophies.length > 0) {
        await userCharacter.save();
        this.logger.log(
          `User ${userProgress.user_id} has earned new trophies: ${newTrophies.map((t) => t.name).join(', ')}`,
        );
      } else {
        this.logger.log(
          `No new trophies earned for user ${userProgress.user_id}`,
        );
      }

      return newTrophies;
    } catch (error) {
      this.logger.error(
        `Failed to process trophy assignment for user: ${userProgress.user_id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'A failure occurred during the trophy assignment process.',
      );
    }
  }
}
