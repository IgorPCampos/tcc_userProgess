export class CreateTrophyDto {
  name: string;
  description: string;
  conditions: {
    type: string;
    value: number;
  };
}
