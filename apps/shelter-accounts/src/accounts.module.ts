import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common'
import { StatusModule } from './status/status.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    StatusModule,
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCOUNTS_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AccountsModule {}
