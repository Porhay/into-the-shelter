import { IsNumber, Max, Min } from 'class-validator';

export class LobbyCreateDto {
  @IsNumber()
  @Max(8)
  @Min(2)
  maxClients: number;

  organizatorId: string;
}
