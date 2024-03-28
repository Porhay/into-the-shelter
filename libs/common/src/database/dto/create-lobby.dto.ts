export class CreateLobbyDto {
  organizatorId: string;
  settings: {
    isPrivate: boolean;
    maxClients: number;
  };
}
