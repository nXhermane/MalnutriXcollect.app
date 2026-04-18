import { Button, Surface } from 'heroui-native';
import { icons } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Icon } from './icons';
export function EmptyState({
  iconName,
  title,
  description,
  onPressIcon,
  children,
}: {
  iconName: keyof typeof icons;
  title: string;
  description: string;
  onPressIcon?: () => void;
  children?: React.ReactNode | React.ReactElement;
}) {
  return (
    <Surface className="p-8 text-center shadow-sm ">
      <View className="gap-4 justify-center items-center">
        {!onPressIcon ? (
          <View className="flex h-v-14  w-v-14 items-center justify-center rounded-full  bg-accent-soft ">
            <Icon name={iconName} size={24} className="text-accent h-5 w-5" />
          </View>
        ) : (
          <Button onPress={onPressIcon} className="h-v-14 w-v-14 rounded-full" isIconOnly>
            <Icon name={iconName} size={24} className="text-white h-5 w-5" />
          </Button>
        )}
        <View className="flex flex-col items-center justify-center">
          <Text className="mb-1 text-center font-body text-sm text-muted">{title}</Text>
          <Text className="text-center font-body text-xs text-muted">{description} </Text>
        </View>
      </View>
      {children && children}
    </Surface>
  );
}
