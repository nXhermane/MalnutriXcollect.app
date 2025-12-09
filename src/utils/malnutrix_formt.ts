import {
  MALNUTRIX_COLLECT_QRCODE_PREFIX,
  MALNUTRIX_COLLECT_QRCODE_PREFIX_REGEX,
  MALNUTRIX_COLLECT_QRCODE_REGEX,
  MALNUTRIX_QRCODE_PREFIX,
  MALNUTRIX_QRCODE_PREFIX_REGEX,
  MALNUTRIX_QRCODE_REGEX,
} from '@/constants';

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
