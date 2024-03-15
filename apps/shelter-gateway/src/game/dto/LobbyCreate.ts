import { IsInt, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {
    @IsString()
    mode: 'solo' | 'duo';

    player: any;
}