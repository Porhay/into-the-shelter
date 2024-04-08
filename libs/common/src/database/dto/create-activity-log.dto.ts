export class CreateActivityLogDto {
  userId: string;
  contestantId?: string;
  lobbyId: string;
  action: string;
  payload: any;
}
