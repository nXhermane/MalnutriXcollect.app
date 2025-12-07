import React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';

export function QRIndicator() {
  const scale = React.useRef(new Animated.Value(1));
  const duration = 500;
  React.useEffect(() => {
    let mounted = true;

    function cycleAnimation() {
      Animated.sequence([
        Animated.timing(scale.current, {
          easing: Easing.in(Easing.quad),
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scale.current, {
          easing: Easing.out(Easing.quad),
          toValue: 1.05,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (mounted) {
          cycleAnimation();
        }
      });
    }
    cycleAnimation();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AnimatedScanner
      style={[
        styles.scanner,
        {
          transform: [{ scale: scale.current }],
        },
      ]}
    />
  );
}

class SvgComponent extends React.Component<SvgProps> {
  render() {
    return (
      <Svg width={258} height={258} viewBox="0 0 258 258" fill="none" {...this.props}>
        <Path
          d="M211 250a4 4 0 000 8v-8zm47-39a4 4 0 00-8 0h8zm-11.5 34l-2.948-2.703L246.5 245zM211 258c6.82 0 14.15-.191 20.795-1.495 6.629-1.3 13.067-3.799 17.653-8.802l-5.896-5.406c-2.944 3.21-7.457 5.212-13.297 6.358C224.433 249.798 217.777 250 211 250v8zm38.448-10.297c4.209-4.59 6.258-10.961 7.322-17.287 1.076-6.395 1.23-13.307 1.23-19.416h-8c0 6.056-.162 12.398-1.119 18.089-.969 5.759-2.669 10.306-5.329 13.208l5.896 5.406zM250 47a4 4 0 008 0h-8zM211 0a4 4 0 000 8V0zm34 11.5l-2.703 2.948L245 11.5zM258 47c0-6.82-.191-14.15-1.495-20.795-1.3-6.629-3.799-13.067-8.802-17.653l-5.406 5.896c3.21 2.944 5.212 7.457 6.358 13.297C249.798 33.568 250 40.223 250 47h8zM247.703 8.552c-4.59-4.209-10.961-6.258-17.287-7.322C224.021.154 217.109 0 211 0v8c6.056 0 12.398.162 18.089 1.119 5.759.969 10.306 2.67 13.208 5.33l5.406-5.897zM8 211a4 4 0 00-8 0h8zm39 47a4 4 0 000-8v8zm-34-11.5l2.703-2.948L13 246.5zM0 211c0 6.82.19 14.15 1.495 20.795 1.3 6.629 3.799 13.067 8.802 17.653l5.406-5.896c-3.21-2.944-5.212-7.457-6.358-13.297C8.202 224.433 8 217.777 8 211H0zm10.297 38.448c4.59 4.209 10.961 6.258 17.287 7.322C33.98 257.846 40.892 258 47 258v-8c-6.056 0-12.398-.162-18.088-1.119-5.76-.969-10.307-2.669-13.209-5.329l-5.406 5.896zM47 8a4 4 0 000-8v8zM0 47a4 4 0 008 0H0zm11.5-34l2.948 2.703L11.5 13zM47 0c-6.82 0-14.15.19-20.795 1.495-6.629 1.3-13.067 3.799-17.653 8.802l5.896 5.406c2.944-3.21 7.457-5.212 13.297-6.358C33.568 8.202 40.223 8 47 8V0zM8.552 10.297c-4.209 4.59-6.258 10.961-7.322 17.287C.154 33.98 0 40.892 0 47h8c0-6.056.162-12.398 1.119-18.088.969-5.76 2.67-10.307 5.33-13.209l-5.897-5.406z"
          fill="#fff"
        />
      </Svg>
    );
  }
}

const AnimatedScanner = Animated.createAnimatedComponent(SvgComponent);

const styles = StyleSheet.create({
  scanner: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});

/**
 * import { StackScreenProps } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Linking, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CameraView from '../components/Camera';
import QRFooterButton from '../components/QRFooterButton';
import QRIndicator from '../components/QRIndicator';
import { ModalStackRoutes } from '../navigation/Navigation.types';

type State = {
  isVisible: boolean;
  url: null | string;
};

const initialState: State = { isVisible: Platform.OS === 'ios', url: null };

export default function BarCodeScreen(props: StackScreenProps<ModalStackRoutes, 'QRCode'>) {
  const [state, setState] = React.useReducer(
    (props: State, state: Partial<State>): State => ({ ...props, ...state }),
    initialState
  );
  const [isLit, setLit] = React.useState(false);

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!state.isVisible) {
      timeout = setTimeout(() => {
        setState({ isVisible: true });
      }, 800);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  React.useEffect(() => {
    if (!state.isVisible && state.url) {
      openUrl(state.url);
    }
  }, [state.isVisible, state.url]);

  const _handleBarCodeScanned = throttle(({ data: url }) => {
    setState({ isVisible: false, url });
  }, 1000);

  const openUrl = (url: string) => {
    props.navigation.pop();

    setTimeout(
      () => {
        // note(brentvatne): Manually reset the status bar before opening the
        // experience so that we restore the correct status bar color when
        // returning to home
        StatusBar.setBarStyle('default');
        Linking.openURL(url);
      },
      Platform.select({
        ios: 16,
        // note(brentvatne): Give the modal a bit of time to dismiss on Android
        default: 500,
      })
    );
  };

  const onCancel = React.useCallback(() => {
    if (Platform.OS === 'ios') {
      props.navigation.pop();
    } else {
      props.navigation.goBack();
    }
  }, []);

  const onFlashToggle = React.useCallback(() => {
    setLit((isLit) => !isLit);
  }, []);

  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {state.isVisible ? (
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={_handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
          enableTorch={isLit}
        />
      ) : null}

      <View style={[styles.header, { top: 40 + top }]}>
        <Hint>Scan an Expo QR code</Hint>
      </View>

      <QRIndicator />

      <View style={[styles.footer, { bottom: 30 + bottom }]}>
        <QRFooterButton onPress={onFlashToggle} isActive={isLit} iconName="flashlight" />
        <QRFooterButton onPress={onCancel} iconName="close" iconSize={48} />
      </View>

      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </View>
  );
}

function Hint({ children }: { children: string }) {
  return (
    <BlurView style={styles.hint} intensity={100} tint="dark">
      <Text style={styles.headerText}>{children}</Text>
    </BlurView>
  );
}

function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  } as T;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});
 */

/**
 * import { HomeFilledIcon, SettingsFilledIcon } from '@expo/styleguide-native';
import { NavigationContainer, useTheme, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StyleSheet, Linking } from 'react-native';

import BottomTab, { getNavigatorProps } from './BottomTabNavigator';
import { HomeStackRoutes, SettingsStackRoutes, ModalStackRoutes } from './Navigation.types';
import defaultNavigationOptions from './defaultNavigationOptions';
import DiagnosticsIcon from '../components/Icons';
import { ColorTheme } from '../constants/Colors';
import Themes from '../constants/Themes';
import { AccountModal } from '../screens/AccountModal';
import { BranchDetailsScreen } from '../screens/BranchDetailsScreen';
import { BranchListScreen } from '../screens/BranchListScreen';
import { DiagnosticsStackScreen } from '../screens/DiagnosticsScreen';
import { FeedbackFormScreen } from '../screens/FeedbackFormScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProjectScreen } from '../screens/ProjectScreen';
import { ProjectsListScreen } from '../screens/ProjectsListScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SnacksListScreen } from '../screens/SnacksListScreen';
import {
  alertWithCameraPermissionInstructions,
  requestCameraPermissionsAsync,
} from '../utils/PermissionUtils';

// TODO(Bacon): Do we need to create a new one each time?
const HomeStack = createStackNavigator<HomeStackRoutes>();
const SettingsStack = createStackNavigator<SettingsStackRoutes>();

// We have to disable this option on Android to not use `react-native-screen`,
// which aren't correcly installed in the Home app.
const shouldDetachInactiveScreens = Platform.OS !== 'android';

function useThemeName() {
  const theme = useTheme();
  return theme.dark ? ColorTheme.DARK : ColorTheme.LIGHT;
}

function HomeStackScreen() {
  const themeName = useThemeName();

  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      detachInactiveScreens={shouldDetachInactiveScreens}
      screenOptions={defaultNavigationOptions(themeName)}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="ProjectsList"
        component={ProjectsListScreen}
        options={{
          title: 'Projects',
        }}
      />
      <HomeStack.Screen
        name="SnacksList"
        component={SnacksListScreen}
        options={{
          title: 'Snacks',
        }}
      />
      <HomeStack.Screen
        name="ProjectDetails"
        component={ProjectScreen}
        options={{
          title: 'Project',
        }}
      />
      <HomeStack.Screen
        name="Branches"
        component={BranchListScreen}
        options={{
          title: 'Branches',
        }}
      />
      <HomeStack.Screen
        name="BranchDetails"
        component={BranchDetailsScreen}
        options={{
          title: 'Branch',
        }}
      />
      <HomeStack.Screen
        name="FeedbackForm"
        component={FeedbackFormScreen}
        options={{
          title: 'Share your feedback',
        }}
      />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  const themeName = useThemeName();

  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      detachInactiveScreens={shouldDetachInactiveScreens}
      screenOptions={defaultNavigationOptions(themeName)}>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerBackImage: () => <></>,
        }}
      />
    </SettingsStack.Navigator>
  );
}

const RootStack = createStackNavigator();

function TabNavigator(props: { theme: string }) {
  return (
    <BottomTab.Navigator
      {...getNavigatorProps(props)}
      initialRouteName="HomeStack"
      detachInactiveScreens={shouldDetachInactiveScreens}>
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          tabBarIcon: (props: any) =>
            Platform.OS === 'ios' ? (
              {
                ios: {
                  type: 'sfSymbol',
                  name: 'house.fill',
                },
              }
            ) : (
              <HomeFilledIcon {...props} style={styles.icon} size={24} />
            ),
          tabBarLabel: 'Home',
        }}
      />

      {Platform.OS === 'ios' && (
        <BottomTab.Screen
          name="DiagnosticsStack"
          component={DiagnosticsStackScreen}
          options={{
            tabBarIcon: (props: any) =>
              Platform.OS === 'ios' ? (
                { ios: { name: 'ecg.text.page.fill', type: 'sfSymbol' } }
              ) : (
                <DiagnosticsIcon {...props} style={styles.icon} size={24} />
              ),
            tabBarLabel: 'Diagnostics',
          }}
        />
      )}
      <BottomTab.Screen
        name="SettingsScreen"
        component={SettingsStackScreen}
        options={{
          title: 'Settings',
          tabBarIcon: (props: any) =>
            Platform.OS === 'ios' ? (
              { ios: { name: 'gearshape.fill', type: 'sfSymbol' } }
            ) : (
              <SettingsFilledIcon {...props} style={styles.icon} size={24} />
            ),
          tabBarLabel: 'Settings',
        }}
      />
    </BottomTab.Navigator>
  );
}

const ModalStack = createStackNavigator<ModalStackRoutes>();

export default (props: { theme: ColorTheme }) => {
  const navigationRef = useNavigationContainerRef<ModalStackRoutes>();
  const isNavigationReadyRef = React.useRef(false);
  const initialURLWasConsumed = React.useRef(false);

  React.useEffect(() => {
    const handleDeepLinks = async ({ url }: { url: string | null }) => {
      if (Platform.OS === 'ios' || !url || !isNavigationReadyRef.current) {
        return;
      }
      const nav = navigationRef.current;
      if (!nav) {
        return;
      }

      if (url.startsWith('expo-home://qr-scanner')) {
        if (await requestCameraPermissionsAsync()) {
          nav.navigate('QRCode');
        } else {
          await alertWithCameraPermissionInstructions();
        }
      }
    };
    if (!initialURLWasConsumed.current) {
      initialURLWasConsumed.current = true;
      Linking.getInitialURL().then((url) => {
        handleDeepLinks({ url });
      });
    }

    const deepLinkSubscription = Linking.addEventListener('url', handleDeepLinks);

    return () => {
      isNavigationReadyRef.current = false;
      deepLinkSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      theme={Themes[props.theme]}
      ref={navigationRef}
      onReady={() => {
        isNavigationReadyRef.current = true;
      }}>
      <ModalStack.Navigator
        initialRouteName="RootStack"
        detachInactiveScreens={shouldDetachInactiveScreens}
        screenOptions={({ route: _route, navigation: _navigation }) => ({
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent' },
          presentation: 'modal',
          // NOTE(brentvatne): it is unclear what this was intended for, it doesn't appear to be needed?
          // headerStatusBarHeight: navigation.getState().routes.indexOf(route) > 0 ? 0 : undefined,
          ...TransitionPresets.ModalPresentationIOS,
        })}>
        <ModalStack.Screen name="RootStack">
          {() => (
            <RootStack.Navigator
              initialRouteName="Tabs"
              detachInactiveScreens={shouldDetachInactiveScreens}
              screenOptions={{ presentation: 'modal' }}>
              <RootStack.Screen name="Tabs" options={{ headerShown: false }}>
                {() => <TabNavigator theme={props.theme} />}
              </RootStack.Screen>
              <RootStack.Screen
                name="Account"
                component={AccountModal}
                options={({ route: _route, navigation: _navigation }) => ({
                  headerShown: false,
                  ...(Platform.OS === 'ios' && {
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    // NOTE(brentvatne): it is unclear what this was intended for, it doesn't appear to be needed?
                    // headerStatusBarHeight:
                    //   navigation
                    //     .getState()
                    //     .routes.findIndex((r: RouteProp<any, any>) => r.key === route.key) > 0
                    //     ? 0
                    //     : undefined,
                    ...TransitionPresets.ModalPresentationIOS,
                  }),
                })}
              />
            </RootStack.Navigator>
          )}
        </ModalStack.Screen>
        <ModalStack.Screen name="QRCode" component={QRCodeScreen} />
      </ModalStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginBottom: Platform.OS === 'ios' ? -3 : 0,
  },
});
 */
