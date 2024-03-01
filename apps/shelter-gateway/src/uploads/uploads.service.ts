import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import * as FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService, FirebaseService } from '@app/common'
import { CreateFileDto } from '@app/common/database/dto/create-file.dto';


@Injectable()
export class UploadsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly firebaseService: FirebaseService,
        private readonly databaseService: DatabaseService
    ) { }

    private deleteLocal(files: any) {
        files.forEach((element: { filename: string; }) => {
            fs.unlink(path.join('data/images', element.filename), (err) => err ? console.error('Error deleting local file:', err) :
                console.log('Local file deleted successfully.'))
        });
        return
    }

    async filesUpload(userId: string, files: any, fileType: string): Promise<any> {
        let remainPositions: number[] = []

        if (fileType === 'avatar' && files.length > 1) {
            return this.deleteLocal(files)
        }
        if (fileType === 'gameAvatar') {
            const dbFiles = await this.databaseService.getFilesByUserId(userId, fileType)

            // max length for game avatars is reached. Delete local file only.
            if (dbFiles && dbFiles.length >= 4) {
                return this.deleteLocal(files)
            }

            if (dbFiles) {
                const takenPositions: number[] = []
                dbFiles.forEach(f => takenPositions.push(JSON.parse(f.metadata).position));
                takenPositions.sort((a, b) => a - b); // sort from min to max
                remainPositions = [1, 2, 3, 4].filter(elem => !takenPositions.includes(elem)); // keep only in free fields
            }
        }

        const uploadedFiles = []
        for (const file of files) {
            const downloadUrl = await this.firebaseService.singleUpload(file)
            const context: CreateFileDto = {
                userId: userId,
                filename: file.filename,
                size: file.size,
                mime: file.mimetype,
            }

            if (fileType) {
                context.type = fileType // ie: gameAvatar or avatar
            }
            if (fileType && fileType === 'gameAvatar') {
                context.metadata = JSON.stringify({ position: remainPositions.shift() }) // get only first and delete from arr
            }
            if (fileType && fileType === 'avatar') {
                this.databaseService.updateUser(userId, { avatar: downloadUrl })
            }

            const dbFile = await this.databaseService.createFile(context)
            console.log(`File created, id:${dbFile.id}`);
            dbFile.metadata = JSON.parse(dbFile.metadata)
            uploadedFiles.push({ downloadUrl: downloadUrl, metadata: dbFile.metadata, fileId: dbFile.id })
        }
        return uploadedFiles
    }

    async getFiles(userId: string, type: string): Promise<object> {
        return await this.databaseService.getFilesByUserId(userId, type)
    }

    async deleteFile(fileId: string) {        
        const file = await this.databaseService.getFileById(fileId)
        if (file) {
            await this.firebaseService.deleteFile(file.filename)
            return await this.databaseService.deleteFile(fileId)
        }
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
