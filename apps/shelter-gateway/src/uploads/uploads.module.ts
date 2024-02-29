import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'config';


@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [UploadsController],
  // providers: [UploadsService]
})
export class UploadsModule {}
