import { Controller, Get, Param, Query } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';

@Controller('users/:userId/lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Get('')
  async getAllPublicLobbis(@Param('userId') userId: string) {
    return await this.lobbiesService.getAllPublicLobbis();
  }
}
