import * as crypto from 'crypto';

export const makeToken = (length: number = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
