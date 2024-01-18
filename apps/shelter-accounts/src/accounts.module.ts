import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';

@Module({
  imports: [
    StatusModule,
  ],
  controllers: [],
  providers: [],
})
export class AccountsModule {}
