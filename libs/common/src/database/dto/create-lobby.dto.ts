export class CreateLobbyDto {
  organizatorId: string;
  key: string;
  settings: {
    isPrivate: boolean;
    maxClients: number;
  };
}
