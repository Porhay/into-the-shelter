import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common'

@Module({
  imports: [
    StatusModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GATEWAY_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
