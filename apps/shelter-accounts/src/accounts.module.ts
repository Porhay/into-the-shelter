import { DatabaseModule, FirebaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { PaypalController } from './paypal/paypal.controller';
import { PaypalModule } from './paypal/paypal.module';
import { PaypalService } from './paypal/paypal.service';
import { UserProductsController } from './user-products/user-products.controller';
import { UserProductsModule } from './user-products/user-products.module';
import { UserProductsService } from './user-products/user-products.service';
import config from 'config';

@Module({
  imports: [
    StatusModule,
    UsersModule,
    AuthModule,
    PaypalModule,
    UserProductsModule,
    DatabaseModule,
    FirebaseModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [
    AuthController,
    UsersController,
    PaypalController,
    UserProductsController,
  ],
  providers: [AuthService, UsersService, PaypalService, UserProductsService],
})
export class AccountsModule {}
