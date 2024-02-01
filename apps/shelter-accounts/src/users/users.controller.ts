import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { DatabaseService } from '@app/common'

@Controller('users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService,) {}

  @Post()
  async createUser(@Body() user: {displayName: string, email: string}) {
    return this.databaseService.createUser(user);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.databaseService.deleteUser(Number(userId));
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.databaseService.getUserById(Number(userId));
  }
}
