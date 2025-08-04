import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCharacter } from './user_character.entity';
import { CreateUserCharacterDto } from './dto/create-user_character.dto';
import { IUserProgress } from './interface/userProgress.interface';
import { Trophy } from 'src/trophies/schemas/trophy.schema';
import { TrophyService } from 'src/trophies/trophies.service';

@Injectable()
export class UserCharacterService {
  constructor(
    @InjectModel(UserCharacter.name)
    private userCharacterModel: Model<UserCharacter>,

    private trophyService: TrophyService,
  ) {}

  async create(
    createUserCharacterDto: CreateUserCharacterDto,
  ): Promise<UserCharacter> {
    const createdUserCharacter = new this.userCharacterModel(
      createUserCharacterDto,
    );
    return createdUserCharacter.save();
  }

  async findAll(): Promise<UserCharacter[]> {
    return this.userCharacterModel.find().exec();
  }

  async findOne(id: string): Promise<UserCharacter> {
    const UserCharacter = await this.userCharacterModel.findById(id);
    if (!UserCharacter) throw new NotFoundException('Pefil não encontrado');
    return UserCharacter;
  }

  async updatePointsAndLevel(userProgress: IUserProgress) {
    try {
      const userChar = await this.userCharacterModel.find({
        user_id: userProgress.user_id,
      });

      if (!userChar) {
        const userCharacter = new this.userCharacterModel(userProgress);
        return await userCharacter.save();
      }

      const newPoints = userProgress?.points + userChar[0].points;
      userChar[0].points = newPoints;

      const newLevel = Math.floor(newPoints / 1000) + 1;

      if (newLevel > userChar[0].level) {
        console.log(`Subiu de nível! ${userChar[0].level} para ${newLevel}`);
        userChar[0].level = newLevel;

        await this.trophyService.assignTrophy(userProgress, userChar[0]);
      } else {
        console.log(
          `Pontos atualizados: ${newPoints}, nível atual: ${userChar[0].level}`,
        );

        await this.trophyService.assignTrophy(userProgress, userChar[0]);
      }

      await userChar[0].save();

      return userChar;
    } catch (error: any) {
      throw new BadRequestException(
        'Erro durante a atualização: ' + (error.message || error),
      );
    }
  }

  async getStats(user_id: string): Promise<any> {
    const userChar = await this.userCharacterModel.findOne({
      user_id: user_id,
    });

    if (!userChar) return null;

    const trophies = await this.trophyService.findAll();

    const userTrophyList = trophies.filter((t) =>
      userChar.trophies.includes(t._id.toString()),
    );

    return {
      level: userChar.level,
      points: userChar.points,
      trophies: userTrophyList,
    };
  }
}
