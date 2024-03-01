import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firebaseConfig } from 'config';


admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
  storageBucket: firebaseConfig.storageBucket,
});


@Injectable()
export class FirebaseService {
  constructor() { }

  private bucket = admin.storage().bucket();

  async getSignedUrlByFilename(filename: string, expireIn?: number): Promise<string> {
    try {
      const fileRef = this.bucket.file(filename);
      const currentDate = new Date();

      if (expireIn) {
        const expirationDate = new Date(currentDate.setDate(currentDate.getDate() + expireIn)); // Set expiration to <expireIn> day from now
        const [url] = await fileRef.getSignedUrl({ action: 'read', expires: expirationDate });
        return url;
      }

      const expirationDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 10)); // Set the expiration to 10 years from now
      const [url] = await fileRef.getSignedUrl({ action: 'read', expires: expirationDate });
      return url;

    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  async singleUpload(file: { filename: string; mimetype: string }): Promise<string | null> {
    try {
      const { filename, mimetype } = file;
      const IMAGES_FOLDER = 'data/images';
      const localFilePath = path.join(IMAGES_FOLDER, filename);

      await this.bucket.upload(localFilePath, {
        destination: filename,
        metadata: {
          contentType: mimetype,
        },
      });

      const downloadUrl = await this.getSignedUrlByFilename(filename);
      console.log(downloadUrl);

      fs.unlink(localFilePath, (err) => err ? console.error('Error deleting local file:', err) :
        console.log('Local file deleted successfully.'))

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  async deleteFile(file: { filename: string }): Promise<string | null> {
    try {
      const { filename } = file;
      await this.bucket.file(filename).delete();
      return `File ${filename} deleted successfully.`;
    } catch (error) {
      console.error('Error while file deletion:', error);
      return null;
    }
  }
}
