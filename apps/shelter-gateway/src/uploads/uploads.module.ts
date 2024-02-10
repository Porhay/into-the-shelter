import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';


@Module({
  controllers: [UploadsController],
  // providers: [UploadsService]
})
export class UploadsModule {}
