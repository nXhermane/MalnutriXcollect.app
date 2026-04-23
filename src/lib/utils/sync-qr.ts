import { cryptoDecode } from './crypto';

const QR_PREFIX = 'malnutrix::data::';

export interface SyncConnectionInfo {
  host: string;
  port: number;
  ssid: string;
  password: string;
}

export function decodeSyncQR(raw: string): SyncConnectionInfo | null {
  try {
    if (!raw.startsWith(QR_PREFIX)) return null;
    const encodedString = raw.slice(QR_PREFIX.length);
    const decoded = cryptoDecode(encodedString);
    if (!decoded) return null;
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    const host = parsed['host'];
    const port = parsed['port'];
    const ssid = parsed['ssid'];
    const password = parsed['password'];
    if (
      typeof host !== 'string' ||
      typeof port !== 'number' ||
      typeof ssid !== 'string' ||
      typeof password !== 'string'
    )
      return null;
    return { host, port, ssid, password };
  } catch {
    return null;
  }
}
