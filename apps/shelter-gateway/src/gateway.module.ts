import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common'
import { StatusModule } from './status/status.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChatGateway } from './chat/chat.gateway';
import config from '../../../config'

@Module({
  imports: [
    StatusModule,
    UploadsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class GatewayModule {}
