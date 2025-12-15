import {
  MALNUTRIX_COLLECT_QRCODE_PREFIX,
  MALNUTRIX_COLLECT_QRCODE_PREFIX_REGEX,
  MALNUTRIX_COLLECT_QRCODE_REGEX,
  MALNUTRIX_QRCODE_PREFIX,
  MALNUTRIX_QRCODE_PREFIX_REGEX,
  MALNUTRIX_QRCODE_REGEX,
} from '@/constants';
import * as v from 'valibot';
import { decode } from './crypto';
export function formatForMalnutriX(data: string) {
  return `${MALNUTRIX_QRCODE_PREFIX}${data}`;
}
export function isMalnutriXCollectUri(uri: string) {
  return MALNUTRIX_COLLECT_QRCODE_REGEX.test(uri);
}

export function isMalnutriXUri(uri: string) {
  return MALNUTRIX_QRCODE_REGEX.test(uri);
}

export function getMalnutriXPayload(uri: string) {
  if (isMalnutriXUri(uri)) {
    return uri.replace(MALNUTRIX_QRCODE_PREFIX_REGEX, '');
  }
  return null;
}
export function getMalnutriXCollectPayload(uri: string) {
  if (isMalnutriXCollectUri(uri)) {
    return uri.replace(MALNUTRIX_COLLECT_QRCODE_PREFIX_REGEX, '');
  }
  return null;
}
export function formatForMalnutriXCollect(data: string) {
  return `${MALNUTRIX_COLLECT_QRCODE_PREFIX}${data}`;
}
export function getMalnutriXPayloadContent(paylaod: string) {
  const schema = v.object({
    host: v.pipe(v.string(), v.ip()),
    port: v.pipe(v.number()),
    ssid: v.pipe(v.string(), v.nonEmpty()),
    password: v.pipe(v.string(), v.nonEmpty()),
  });
  const decoded_data = decode(paylaod);
  if (decoded_data === null) {
    throw new Error('Erreur de déchiffrement');
  }
  const data = JSON.parse(decoded_data);
  const validateData = v.safeParse(schema, data);
  if (!validateData.success) {
    throw new Error('Contenu du qrcode corrompu.');
  }
  return validateData.output;
}
