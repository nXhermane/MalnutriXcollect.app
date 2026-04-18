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
    const decoded = cryptoDecode(raw);
    if (!decoded) return null;
    if (!decoded.startsWith(QR_PREFIX)) return null;
    const json = decoded.slice(QR_PREFIX.length);
    const parsed = JSON.parse(json) as Record<string, unknown>;
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
