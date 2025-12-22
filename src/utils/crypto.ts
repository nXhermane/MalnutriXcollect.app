import QuickCrypto, { randomUUID } from 'react-native-quick-crypto';
import { Buffer } from 'buffer';
type CryptoBuffer = Parameters<ReturnType<typeof QuickCrypto.createDecipheriv>['setAuthTag']>[0];
let SECRET_KEY: Buffer | null = null;

try {
  const key = process.env.EXPO_PUBLIC_SECRET_KEY;
  if (key && /^[0-9a-fA-F]{64}$/.test(key)) {
    SECRET_KEY = Buffer.from(key, 'hex');
  }
} catch (e) {
  console.error('Failed to initialize crypto:', e);
}

export function isCryptoAvailable(): boolean {
  return SECRET_KEY !== null;
}

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export function encode(data: string) {
  if (!SECRET_KEY) {
    throw new Error('Crypto not initialized');
  }
  const iv = QuickCrypto.randomBytes(12);
  const cipher = QuickCrypto.createCipheriv('aes-256-gcm', SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decode(data: string) {
  try {
    if (!SECRET_KEY) {
      throw new Error('Crypto not initialized');
    }
    const encryptedBuffer = Buffer.from(data, 'base64');
    const iv = encryptedBuffer.subarray(0, IV_LENGTH);
    const tag = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encryptedData = encryptedBuffer.subarray(IV_LENGTH + TAG_LENGTH);
    const decipher = QuickCrypto.createDecipheriv('aes-256-gcm', SECRET_KEY, iv);
    decipher.setAuthTag(tag as unknown as CryptoBuffer);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
}

export { randomUUID };
