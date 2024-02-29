import {
  Controller, Get, Param, Post, Res,
  UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'config';
import { UploadsService } from './uploads.service';

@Controller('users/:userId/files')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService
  ) { }

  @Post('')
  @UseInterceptors(FilesInterceptor('files', 4, multerConfig))
  async filesUpload(@UploadedFiles() files: Array<Express.Multer.File>, @Param('userId') userId: string, ) {
    return this.uploadsService.filesUpload(userId, files)
  }

  @Get(':fileId/')
  async getFile() {
    return this.uploadsService.getFile();
  }

  @Post('update-background')
  async updateBackground(@Res() res: Response) {
    try {
      const procFilepath = await this.uploadsService.updateBackground()
      return res.sendFile(procFilepath);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}
