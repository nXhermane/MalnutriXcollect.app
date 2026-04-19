import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MalnutriX Collect',
  slug: 'malnutrix_collect',
  version: '2.0.0-beta.4',
  orientation: 'portrait',
  icon: './assets/images/malnutrix.ic.launcher.png',
  scheme: 'malnutrixcollect',
  userInterfaceStyle: 'automatic',

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nxhermano.malnutrix.collect',
    icon: './assets/images/malnutrix.ic.launcher.png',
    infoPlist: {
      NSCameraUsageDescription:
        'Allow $(PRODUCT_NAME) to access your camera for capturing nutritional data and photos.',
      NSMicrophoneUsageDescription:
        'Allow $(PRODUCT_NAME) to access your microphone for recording audio.',
      NSPhotoLibraryUsageDescription:
        'Allow $(PRODUCT_NAME) to access your photo library to save and select photos.',
      NSPhotoLibraryAddUsageDescription:
        'Allow $(PRODUCT_NAME) to save photos to your photo library.',
    },
    splash: {
      image: './assets/images/malnutrix.ic.launcher.light.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    requireFullScreen: false,
    userInterfaceStyle: 'automatic',
  },

  android: {
    adaptiveIcon: {
      backgroundImage: './assets/images/malnutrix.ic.launcher.png',
      monochromeImage: './assets/images/malnutrix.ic.launcher.png',
      foregroundImage: './assets/images/malnutrix.ic.launcher.png',
      backgroundColor: '#000000',
    },
    predictiveBackGestureEnabled: false,
    permissions: ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'],
    package: 'com.nxhermano.malnutrix.collect',
  },

  web: {
    output: 'static',
    favicon: './assets/images/malnutrix.ic.launcher.png',
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
        microphonePermissionText: 'Allow $(PRODUCT_NAME) to access your microphone',
      },
    ],
    'react-native-wifi-reborn',
    '@react-native-google-signin/google-signin',
    'expo-sqlite',
    '@react-native-community/datetimepicker',
    'expo-image',
    'react-native-enriched-markdown',
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
