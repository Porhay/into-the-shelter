import { DatabaseService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { createUserProductRequest } from './dto/createUserProduct.request';
import { products } from 'config';

@Injectable()
export class UserProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Use when user submit purchese by coins
   * @param userId
   * @param data
   * @returns
   */
  async createUserProduct(userId: string, data: createUserProductRequest) {
    const userProduct = await this.databaseService.createUserProduct({
      userId: userId,
      productId: data.productId,
      status: 'ACTIVE',
    });

    // reduce user coins balance
    const productPrice = products[data.productId].coins;
    const user = await this.databaseService.getUserByIdOrNull(userId);
    await this.databaseService.updateUser(userId, {
      coins: user.coins - productPrice,
    });

    return userProduct;
  }

  async getUserProducts(userId: string) {
    return await this.databaseService.getUserProductsByUserId(userId);
  }
}
