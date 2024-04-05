export class CreateActivityLogDto {
  userId: string;
  lobbyId: string;
  action: string;
  payload: string;
}
