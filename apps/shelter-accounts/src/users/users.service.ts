import { DatabaseService, FirebaseService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getUserById(userId: string): Promise<any> {
    const dbUser = await this.databaseService.getUserByIdOrNull(userId);

    const updatedGameAvatars = [];

    // Get game avatars from files
    const gameAvatars = await this.databaseService.getFilesByUserId(
      dbUser.id,
      'gameAvatar',
    );
    for (const elem of gameAvatars) {
      const downloadUrl = await this.firebaseService.getSignedUrlByFilename(
        elem.filename,
      );
      updatedGameAvatars.push({
        metadata: JSON.parse(elem.metadata),
        downloadUrl,
        fileId: elem.id,
      });
    }

    // Get user products
    const userProducts =
      await this.databaseService.getUserProductsByUserId(userId);

    const res = {
      ...dbUser,
      gameAvatars: updatedGameAvatars,
      userProducts: userProducts,
    };
    return res;
  }
}
