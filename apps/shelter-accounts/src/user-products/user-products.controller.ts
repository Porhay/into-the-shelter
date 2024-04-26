import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createUserProductRequest } from './dto/createUserProduct.request';
import { UserProductsService } from './user-products.service';

@Controller('users/:userId/user-products')
export class UserProductsController {
  constructor(private readonly userProductsService: UserProductsService) {}

  @Post('')
  async createUserProduct(
    @Body() body: createUserProductRequest,
    @Param('userId') userId: string,
  ) {
    return await this.userProductsService.createUserProduct(userId, body);
  }

  @Get('')
  async getUserProducts(@Param('userId') userId: string) {
    return this.userProductsService.getUserProducts(userId);
  }
}
