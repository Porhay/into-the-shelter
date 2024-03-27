import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'config';
import { UploadsService } from './uploads.service';

@Controller('users/:userId/files')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files', 4, multerConfig))
  async filesUpload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('userId') userId: string,
    @Body('type') type: string,
  ) {
    return this.uploadsService.filesUpload(userId, files, type);
  }

  @Get(':fileId')
  async getFile(@Param('userId') userId: string, @Query('type') type: string) {
    return this.uploadsService.getFiles(userId, type);
  }

  @Delete(':fileId')
  async deleteFile(
    @Param('userId') userId: string,
    @Param('fileId') fileId: string,
  ) {
    return this.uploadsService.deleteFile(fileId);
  }

  @Post('update-background')
  async updateBackground(@Res() res: Response) {
    try {
      const procFilepath = await this.uploadsService.updateBackground();
      return res.sendFile(procFilepath);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
