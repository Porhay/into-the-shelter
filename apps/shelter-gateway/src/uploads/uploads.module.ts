import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'config';
import { UploadsService } from './uploads.service';
import { FirebaseModule } from '@app/common';


@Module({
  imports: [MulterModule.register(multerConfig), FirebaseModule],
  controllers: [UploadsController],
  providers: [UploadsService]
})
export class UploadsModule {}
