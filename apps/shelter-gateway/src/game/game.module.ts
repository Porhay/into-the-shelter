import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [ActivityLogsModule],
  providers: [DatabaseModule, ActivityLogsModule],
})
export class GameModule {}
