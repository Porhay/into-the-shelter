import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
