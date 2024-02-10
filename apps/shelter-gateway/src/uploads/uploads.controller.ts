import { Controller, Get, Post, Res } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { Response } from 'express';
import * as path from 'path';

const folderPath: string = './persistent/image-data/';
const MLURL: string = `http://127.0.0.1:8008` // shelter-ml

@Controller('uploads')
export class UploadsController {
  constructor() {}

  @Post('update-background')
  async uploadFile(@Res() res: Response) {
    const filePath = folderPath + 'profile-image-default.jpg';

    try {
      const fileStream = fs.createReadStream(filePath);
      const formData = new FormData();

      // Append file to the form data
      formData.append('file', fileStream);

      // Axios request with form data
      const response = await axios.post(`${MLURL}/update-background/`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
      });

      if (response.data) {
        const newFilePath = folderPath + 'file1.jpg';
        fs.writeFileSync(newFilePath, response.data);

        // res
        //   .status(200)
        //   .header('Content-Length', response.data.length)
        //   .header('Content-Disposition', 'attachment; filename=file1.jpg')
        //   .send(response.data);
        // return { status: 'OK' };

        const filePath = path.join(__dirname, '../../../persistent/image-data/', 'file1.jpg');
        return res.sendFile(filePath);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
