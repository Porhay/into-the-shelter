import { DatabaseService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LobbiesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllPublicLobbis() {
    return await this.databaseService.getAllPublicLobbis();
  }
}
