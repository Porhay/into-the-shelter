export class CreateLobbyDto {
  organizatorId: string;
  settings: string; // {maxClients: number, isPrivate: boolean}
}
