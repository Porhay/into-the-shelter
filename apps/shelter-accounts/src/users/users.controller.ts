import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseService, User } from '@app/common'

@Controller('users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  async createUser(@Body() user: User) {
    return this.databaseService.createUser(user);
  }
}
