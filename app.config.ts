import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MalnutriX collect',
  slug: 'Malnutrix_collect',
  version: '1.0.0',
  orientation: 'portrait',
  "icon": "./assets/images/malnutrix.ic.launcher.dark.png",
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
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
        recordAudioAndroid: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: 'd6e4f647-b746-4d5e-98b5-fd4af11b424f',
    },
  },
  owner: 'nxhermano',
});
