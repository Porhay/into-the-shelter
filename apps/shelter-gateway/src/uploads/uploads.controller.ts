import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import * as FormData from 'form-data';
import { Controller, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'config';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly configService: ConfigService) { }

  @Post('update-background')
  async uploadFile(@Res() res: Response) {
    const imagesFolderPath = 'data/images'

    const filename = 'profile-image-default.jpg';
    const filepath: string = path.join(imagesFolderPath, filename);

    try {
      const fileStream = fs.createReadStream(filepath);
      const formData = new FormData();

      // Append file to the form data
      formData.append('file', fileStream);

      // Axios request with form data
      const mlUrl = this.configService.get<string>('ML_URL');
      const response = await axios.post(`${mlUrl}/update-background/`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
      });

      if (response.data) {
        const procFilename: string = 'file1.jpg'
        const procFilepath = path.join(__dirname, '../../../data/images/', procFilename);

        fs.writeFileSync(procFilepath, response.data);
        return res.sendFile(procFilepath);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 4, multerConfig)) 
  async filesUpload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }
  
}
