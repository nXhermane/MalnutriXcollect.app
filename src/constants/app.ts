import { version } from '../../package.json';

export const MALNUTRIX_WEBSITE_URL =
  process.env.EXPO_PUBLIC_APP_WEBSITE_URL ?? 'https://malnutrix.app';

export const APP_VERSION = version;
export const IS_BETA = version.includes('-beta');
