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
import config from 'config';
import { PaypalService } from './paypal/paypal.service';

@Module({
  imports: [
    StatusModule,
    UsersModule,
    AuthModule,
    PaypalModule,
    DatabaseModule,
    FirebaseModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController, UsersController, PaypalController],
  providers: [AuthService, UsersService, PaypalService],
})
export class AccountsModule {}
