import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    StatusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GATEWAY_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/shelter-gateway/.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
