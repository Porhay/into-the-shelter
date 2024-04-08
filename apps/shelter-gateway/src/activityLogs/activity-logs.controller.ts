import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';

@Controller('users/:userId/lobbies/:lobbyId/activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get('')
  async getActivityLogsByLobbyId(
    @Param('userId') userId: string,
    @Param('lobbyId') lobbyId: string,
  ) {
    return await this.activityLogsService.getActivityLogsByLobbyId(
      userId,
      lobbyId,
    );
  }

  @Post('')
  async createActivityLog(
    @Param('userId') userId: string,
    @Param('lobbyId') lobbyId: string,
    @Body() activityLog: { payload: any; action: string },
  ) {
    return await this.activityLogsService.createActivityLog({
      ...activityLog,
      userId,
      lobbyId,
    });
  }
}
