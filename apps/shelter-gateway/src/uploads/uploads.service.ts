import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import * as FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '@app/common'


@Injectable()
export class UploadsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly firebaseService: FirebaseService
    ) { }

    async filesUpload(userId, files: any): Promise<any> {
        // const {mimetype, filename, size} = req.files[0]

        const downloadUrlsWithId: { downloadUrl: string, fileId?: any }[] = []
        for (const file of files) {
            // const { mimetype, filename, size } = file
            const dUrl = await this.firebaseService.singleUpload(file)

            // const file = await dal.files.create({
            //     userId: userId,
            //     filename: filename,
            //     size: size,
            //     mime: mimetype,
            // })
            // const user = await dal.users.updateUserFields(userId, {image: file.id})
            downloadUrlsWithId.push({ downloadUrl: dUrl }) //, fileId: file.id
        }
        return downloadUrlsWithId
    }

    getFile(): object {
        return null
    }

    async updateBackground(): Promise<any> {
        const imagesFolderPath = 'data/images'

        const filename = 'profile-image-default.jpg';
        const filepath: string = path.join(imagesFolderPath, filename);

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
            return procFilepath
        }
    }

}
