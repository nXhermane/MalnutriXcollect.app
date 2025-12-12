import { SweepGradient } from '@shopify/react-native-skia';
import { memo } from 'react';
import QRCode from 'react-native-qrcode-skia';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';

const AnimatedQRItemComponent = ({
  currentIndex,
  index,
  value,
  size = 200,
}: {
  index: number;
  currentIndex: SharedValue<number>;
  value: string;
  size?: number;
}) => {
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
          height: verticalScale(220),
          width: scale(220),
        },
        animatedStyle,
      ]}>
      <QRCode
        size={moderateScale(size)}
        value={value}
        shapeOptions={{
          shape: 'square',
          eyePatternShape: 'square',
          eyePatternGap: 0,
          gap: 0,
        }}
        logoAreaSize={70}
        logo={
          <VStack className="h-14 w-14 justify-center items-center rounded-full bg-card">
            <Text className="text-2xl font-body text-foreground">X</Text>
          </VStack>
        }>
        <SweepGradient
          c={{ x: 100, y: 100 }}
          colors={['#eeca3b', '#3bee3b', '#3bcaee', '#833bee', '#ee3b83']}
        />
      </QRCode>
    </Animated.View>
  );
};

const AnimatedQRItem = memo(AnimatedQRItemComponent);
AnimatedQRItem.displayName = 'AnimatedQRItem';
export { AnimatedQRItem };