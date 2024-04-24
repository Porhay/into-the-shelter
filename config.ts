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
  storageBucket:
    process.env.storageBucket || 'gs://into-the-shelter.appspot.com',
  type: 'service_account',
  project_id: 'into-the-shelter',
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email:
    'firebase-adminsdk-buiok@into-the-shelter.iam.gserviceaccount.com',
  client_id: '100916296756280661809',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

const CLIENT_URL: string = isProduction
  ? process.env.CLIENT_URL || ''
  : 'http://localhost:3000';
const ML_URL: string = isProduction
  ? process.env.ML_URL || ''
  : 'http://localhost:8008'; // or replace localhost with docker container name (http://shelter-ml:8008)

// GENERAL CONFIGS
export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'data/images');
    },
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') +
        '-' +
        Date.now();
      cb(null, `${filename}${path.extname(file.originalname)}`);
    },
  }),
};

export const LOBBY_MAX_LIFETIME = 60 * 60 * 1000; // 1h

// MODULE CONFINGS
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
  SESSION_SECRET: process.env.SESSION_SECRET || 'MyS1cr3t',
  maxAge: process.env.maxAge || 60000 * 60 * 24, // 1d

  // Google OAuth2
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
});

// https://api.together.xyz/
export const AIKey = process.env.AIKey;
export const AIModels = [
  'QWEN/QWEN1.5-72B-CHAT',
  'GARAGE-BAIND/PLATYPUS2-70B-INSTRUCT',
  'NOUSRESEARCH/NOUS-HERMES-2-MIXTRAL-8X7B-SFT',
  'mistralai/Mixtral-8x7B-Instruct-v0.1',
];

export const PAYPAL_CLIENT_ID =
  'Abn1SWO_XOmJvcxwFp17dcfG2QSuzeKrdjk3vRCSROa9pM7oLoNoJdS2E7iYZEz6plEFXn8FWj4gkQ0P';
export const PAYPAL_CLIENT_SECRET =
  'EF1Iz57BWWH2SWCrnB_9MWYwvE4hh1nWP92Ax3h4hp4Ve0fQcNfHkGU6LXcIFoK7MNs2iIWkL5MUOoVt';
export const sandboxUrl = 'https://api-m.sandbox.paypal.com';
