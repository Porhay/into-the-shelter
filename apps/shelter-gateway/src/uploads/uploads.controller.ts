import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import * as FormData from 'form-data';
import { Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly configService: ConfigService) {}

  @Post('update-background')
  async uploadFile(@Res() res: Response) {
    const folderPath: string = './persistent/image-data/';
    const filePath = folderPath + 'profile-image-default.jpg';

    try {
      const fileStream = fs.createReadStream(filePath);
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
        const newFilePath = folderPath + 'file1.jpg';
        fs.writeFileSync(newFilePath, response.data);
        const filePath = path.join(__dirname, '../../../persistent/image-data/', 'file1.jpg');
        return res.sendFile(filePath);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
