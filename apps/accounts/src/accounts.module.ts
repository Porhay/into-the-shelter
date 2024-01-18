import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
