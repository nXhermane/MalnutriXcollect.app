import QRCode from 'react-native-qrcode-svg';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { verticalScale } from 'react-native-size-matters';

export function AnimatedQRItem({
  currentIndex,
  index,
  value,
  size = 200,
}: {
  index: number;
  currentIndex: SharedValue<number>;
  value: string;
  size?: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = currentIndex.value === index;
    const opacity = withTiming(isActive ? 1 : 0, { duration: 0 });
    return {
      opacity,
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: verticalScale(200),
          width: verticalScale(200),
        },
        animatedStyle,
      ]}>
      <QRCode
        size={verticalScale(size)}
        value={value}
        logo={require('./../../../assets/images/malnutrix.ic.launcher.light.png')}
        logoBackgroundColor={'white'}
        logoBorderRadius={50}
      />
    </Animated.View>
  );
}
