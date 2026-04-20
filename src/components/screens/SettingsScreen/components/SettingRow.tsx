import { Icon, IconName } from '@/components/shared/icons';
import { PressableFeedback } from 'heroui-native';
import { Text, View } from 'react-native';

interface SettingRowProps {
  iconName: IconName;
  iconBgClass: string;
  iconColorClass: string;
  label: string;
  description?: string;
  isLast?: boolean;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

export const SettingRow = ({
  iconName,
  iconBgClass,
  iconColorClass,
  label,
  description,
  isLast = false,
  rightElement,
  onPress,
}: SettingRowProps) => {
  const content = (
    <View
      className={`flex-row items-center justify-between px-3 py-3.5 ${!isLast ? 'border-b border-border/10' : ''}`}>
      <View className="flex-row items-center gap-3 flex-1 pr-3">
        <View className={`p-2.5 rounded-xl shrink-0 ${iconBgClass}`}>
          <Icon name={iconName} className={`h-[18px] w-[18px] ${iconColorClass}`} />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-sm text-foreground leading-tight">{label}</Text>
          {description ? (
            <Text className="text-[11px] text-muted/70 mt-0.5 leading-tight" numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      {rightElement}
    </View>
  );

  if (onPress) {
    return <PressableFeedback onPress={onPress}>{content}</PressableFeedback>;
  }

  return content;
};
