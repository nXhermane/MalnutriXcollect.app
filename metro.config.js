const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(
  {
    ...config,
    resolver: {
      resolver: {
        assetExts: [...config.resolver.assetExts, 'pem'],
      },
    },
  },
  { input: './global.css' },
);
