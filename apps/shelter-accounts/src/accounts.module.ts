import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common'
import { StatusModule } from './status/status.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    StatusModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCOUNTS_PORT: Joi.number().required(),
      }),
      envFilePath: './.env',
    }),
    PassportModule.register({ session: true })
  ],
  controllers: [AuthController],
  providers: [],
})
export class AccountsModule {}
