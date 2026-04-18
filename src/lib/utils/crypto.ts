import { Buffer } from 'buffer';
import QuickCrypto from 'react-native-quick-crypto';

const SECRET_KEY_HEX = process.env.EXPO_PUBLIC_SECRET_KEY ?? '';

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer | null {
  if (/^[0-9a-fA-F]{64}$/.test(SECRET_KEY_HEX)) {
    return Buffer.from(SECRET_KEY_HEX, 'hex');
  }
  return null;
}

export function cryptoDecode(data: string): string | null {
  try {
    const key = getKey();
    if (!key) return null;
    const buf = Buffer.from(data, 'base64');
    const iv = buf.subarray(0, IV_LENGTH);
    const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = buf.subarray(IV_LENGTH + TAG_LENGTH);
    const decipher = QuickCrypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag as never);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return null;
  }
}
