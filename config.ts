
/**
 *  [SERVER SIDE] MAIN CONFIG FILE
 */

import * as path from 'path';
import { diskStorage } from 'multer';
import { MulterModuleOptions } from '@nestjs/platform-express/multer';


const isProduction: boolean = process.env.NODE_ENV === 'production';

// Render.com provides a DATABASE_URL environment variable
// DATABASE_URL="postgres://root:root@postgresql:5432/root" 
const DATABASE_URL: string = isProduction
    ? process.env.DATABASE_URL || ''
    : 'postgres://root:root@localhost:5432/root';

export const firebaseConfig = {
    storageBucket: process.env.storageBucket || 'gs://into-the-shelter.appspot.com',
    type: "service_account",
    project_id: "into-the-shelter",
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: "firebase-adminsdk-buiok@into-the-shelter.iam.gserviceaccount.com",
    client_id: "100916296756280661809",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};


const CLIENT_URL: string = isProduction ? process.env.CLIENT_URL || '' : 'http://localhost:3000';
const ML_URL: string = isProduction ? process.env.ML_URL || '' : 'http://localhost:8008'; // or replace localhost with docker container name (http://shelter-ml:8008)


export const multerConfig: MulterModuleOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'data/images');
        },
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + Date.now();
            cb(null, `${filename}${path.extname(file.originalname)}`);
        },
    }),
};


export default () => ({
    isProduction,
    DATABASE_URL,

    CLIENT_URL,
    ML_URL,

    // PORTS
    CLIENT_PORT: process.env.CLIENT_PORT || 3000,
    GATEWAY_PORT: process.env.GATEWAY_PORT || 8000,
    ACCOUNTS_PORT: process.env.ACCOUNTS_PORT || 8001,
    ML_PORT: process.env.ML_PORT || 8008,

    // SESSIONS
    SESSION_SECRET: process.env.SESSION_SECRET || "MyS1cr3t",
    maxAge: process.env.maxAge || 60000 * 60 * 24, // 1d

    // Google OAuth2
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL,

});
