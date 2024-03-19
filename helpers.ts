import * as crypto from 'crypto';

export const generateSixSymbolHash = (): string => {
    const hash = crypto.randomBytes(20).toString('hex');
    return hash.substring(0, 6).toUpperCase();
  }