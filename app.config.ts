import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MalnutriX collect',
  slug: 'malnutrix_collect',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/malnutrix.ic.launcher.dark.png',
  scheme: 'malnutrixcollect',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundImage: './assets/images/malnutrix.ic.launcher.dark.png',
      monochromeImage: './assets/images/malnutrix.ic.launcher.dark.png',
      foregroundImage: './assets/images/malnutrix.ic.launcher.dark.png',
      backgroundColor: '#000000',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'],
    package: 'com.nxhermano.malnutrixcollect',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './assets/images/malnutrix.ic.launcher.light.png',
        resizeMode: 'contain',
        imageWidth: 300,
        dark: {
          image: './assets/images/malnutrix.ic.launcher.dark.png',
          resizeMode: 'contain',
          backgroundColor: '#000000',
          imageWidth: 300,
        },
      },
    ],
    'expo-font',
    'expo-web-browser',
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: 'Allow $(PRODUCT_NAME) to access your camera',
        enableCodeScanner: true,
      },
    ],
    'react-native-wifi-reborn',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: '7ced4a34-682d-4b00-91d2-24243d8d2663',
    },
  },
});
