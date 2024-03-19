import { IsString } from "class-validator";

export class LobbyJoinDto {
    @IsString()
    lobbyId: string;

    player: any
}
