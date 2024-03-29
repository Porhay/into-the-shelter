import { DatabaseService } from '@app/common';
import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  // UseGuards,
} from '@nestjs/common';
// import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { updateUserRequest } from './dto/updateUser.request';
import { UsersService } from './users.service';

@Controller('users')
// @UseGuards(AuthenticatedGuard) // TODO: Investigate why session id is not atached while req from cs
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post()
  async createUser(@Body() user: { displayName: string; email: string }) {
    return this.databaseService.createUser(user);
  }

  @Post(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() data: updateUserRequest,
  ) {
    return this.databaseService.updateUser(userId, data);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.databaseService.deleteUser(userId);
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.usersService.getUserById(userId);
  }
}
