import { DatabaseService } from '@app/common';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createUserProductRequest } from './dto/createUserProduct.request';
import { buyProducts } from 'config';

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
    // check if user already has this product
    const userProducts =
      await this.databaseService.getUserProductsByUserId(userId);
    if (userProducts.map((_) => _.productId).includes(data.productId)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User already own this product.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if user has enough coins on balance
    const user = await this.databaseService.getUserByIdOrNull(userId);
    const productPrice = buyProducts[data.productId].price;
    if (user.coins - productPrice < 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Insufficient coins to buy this product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userProduct = await this.databaseService.createUserProduct({
      userId: userId,
      productId: data.productId,
      status: 'ACTIVE',
    });

    // reduce user coins balance
    await this.databaseService.updateUser(userId, {
      coins: user.coins - productPrice,
    });

    return userProduct;
  }

  async getUserProducts(userId: string) {
    return await this.databaseService.getUserProductsByUserId(userId);
  }
}
