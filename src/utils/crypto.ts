import QuickCrypto from 'react-native-quick-crypto';

export function encode(data: string, secret: string) {
  const iv = QuickCrypto.randomBytes(16);

  const cipher = QuickCrypto.createCipheriv('aes-256-cbc', secret, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

export function decode(encryptedData: string, secret: string) {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = QuickCrypto.createDecipheriv('aes-256-cbc', secret, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
