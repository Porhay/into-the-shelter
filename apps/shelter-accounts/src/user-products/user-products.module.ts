import { Module } from '@nestjs/common';
import { UserProductsService } from './user-products.service';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
  providers: [UserProductsService],
})
export class UserProductsModule {}
