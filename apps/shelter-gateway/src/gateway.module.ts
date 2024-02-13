import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common'
import { StatusModule } from './status/status.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    StatusModule,
    UploadsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GATEWAY_PORT: Joi.number().required(),
      }),
      envFilePath: './.env',
    }),
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class GatewayModule {}
