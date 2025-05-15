import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCharacterDto } from './create-user_character.dto';

export class UpdateUserCharacterDto extends PartialType(CreateUserCharacterDto) {}
