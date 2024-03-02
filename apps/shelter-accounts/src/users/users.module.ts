import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, FirebaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule, FirebaseModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
