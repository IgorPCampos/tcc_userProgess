import {
  BadRequestException,
  Injectable,
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
  constructor(
    @InjectModel(Trophy.name)
    private trophyModel: Model<Trophy>,

    @InjectModel(UserProgress.name)
    private userProgressModel: Model<UserProgress>,
  ) {}

  async create(createTrophyDto: CreateTrophyDto): Promise<Trophy> {
    const createdTrophy = new this.trophyModel(createTrophyDto);
    return createdTrophy.save();
  }

  async findAll(): Promise<Trophy[]> {
    return this.trophyModel.find().exec();
  }

  async findOne(id: string): Promise<Trophy> {
    const Trophy = await this.trophyModel.findById(id);
    if (!Trophy) throw new NotFoundException('Pefil não encontrado');
    return Trophy;
  }

  async assignTrophy(
    userProgress: IUserProgress,
    userCharacter: UserCharacter,
  ): Promise<Trophy[]> {
    const newTrophies: Trophy[] = [];

    // Buscar todos os troféus
    const allTrophies = await this.trophyModel.find().exec();

    // Filtrar troféus que o usuário já possui para evitar duplicidade
    const ownedTrophyIds = new Set(
      userCharacter.trophies.map((t) => t.toString()),
    );

    // Função auxiliar para verificar e adicionar troféus
    const tryAddTrophy = (trophy: Trophy) => {
      if (!ownedTrophyIds.has(trophy._id.toString())) {
        userCharacter.trophies.push(trophy._id.toString());
        ownedTrophyIds.add(trophy._id.toString());
        newTrophies.push(trophy);
      }
    };

    // Verificar troféus do tipo LEVEL
    const levelTrophies = allTrophies.filter((t) => t.conditions.type === 'LEVEL');
    for (const trophy of levelTrophies) {
      if (trophy.conditions.value <= userCharacter.level) {
        tryAddTrophy(trophy);
      }
    }

    // Verificar troféus do tipo LESSON, EXERCISE e SCHOOL_WORK conforme userProgress.type
    if (['LESSON', 'EXERCISE', 'SCHOOL_WORK'].includes(userProgress.type)) {
      // Buscar todos os progressos desse tipo para o usuário
      const userProgresses = await this.userProgressModel.find({
        user_id: userProgress.user_id,
        type: userProgress.type,
      });

      // Filtrar troféus desse tipo
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
      // Salvar alterações do personagem com os novos troféus
      await userCharacter.save();

      console.log(
        `O usuário ${userProgress.user_id} conquistou os troféus: ${newTrophies
          .map((t) => t.name)
          .join(', ')}`,
      );
    } else {
      console.log(
        `Nenhum novo troféu conquistado para o usuário ${userProgress.user_id}`,
      );
    }

    return newTrophies;
  }
}
