import { Icon } from '@/components/shared/icons';
import { vibrate } from '@/lib/utils/haptics';
import { Button, PressableFeedback, Surface, SurfaceVariant } from 'heroui-native';
import { icons } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface MeasureCardLayoutProps {
  iconName: keyof typeof icons;
  iconColorClass: string;
  iconBgClass: string;
  label: string;
  trailing: React.ReactNode;
  updatedAt: string;
  onPress?: () => void;
  onDelete?: () => void;
  isLocked?: boolean;
  surfaceVariant?: SurfaceVariant;
}

function SwipeDeleteAction({
  drag,
  prog,
  onDelete,
}: {
  drag: SharedValue<number>;
  prog: SharedValue<number>;
  onDelete: () => void;
}) {
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 60 }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: prog.value }],
    opacity: prog.value,
  }));

  return (
    <View className="flex-row">
      <Animated.View style={containerStyle} className="flex-row">
        <View className="h-full w-16 items-center justify-center bg-red-500/10 rounded-r-2xl border-l border-red-500/20">
          <Animated.View style={iconStyle}>
            <Button
              variant="danger"
              isIconOnly
              onPress={onDelete}
              className="h-10 w-10 rounded-full shadow-sm">
              <Icon name="Trash2" className="text-white" sizeClassName="text-base" />
            </Button>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

export function MeasureCardLayout({
  iconName,
  iconColorClass,
  iconBgClass,
  label,
  trailing,
  updatedAt,
  onPress,
  onDelete,
  isLocked = false,
  surfaceVariant = 'tertiary',
}: MeasureCardLayoutProps) {
  const time = new Date(updatedAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const card = (
    <PressableFeedback
      onPress={() => {
        if (onPress && !isLocked) {
          vibrate('soft');
          onPress();
        }
      }}
      isDisabled={!onPress || isLocked}>
      <Surface variant={surfaceVariant} className="flex-row items-center gap-3 py-3 px-3">
        <View
          className={`h-9 w-9 items-center justify-center rounded-full shrink-0 ${iconBgClass}`}>
          <Icon name={iconName} sizeClassName="text-sm" className={iconColorClass} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {label}
          </Text>
          <Text className="text-2xs text-muted">{time}</Text>
        </View>
        <View className="items-end shrink-0">{trailing}</View>
        {!isLocked && onPress && (
          <Icon name="ChevronRight" sizeClassName="text-xs" className="text-muted/40" />
        )}
        {isLocked && <Icon name="LockKeyhole" sizeClassName="text-xs" className="text-muted/40" />}
      </Surface>
    </PressableFeedback>
  );

  if (onDelete && !isLocked) {
    return (
      <Swipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={30}
        renderRightActions={(prog, drag) => (
          <SwipeDeleteAction prog={prog} drag={drag} onDelete={onDelete} />
        )}>
        {card}
      </Swipeable>
    );
  }

  return card;
}
