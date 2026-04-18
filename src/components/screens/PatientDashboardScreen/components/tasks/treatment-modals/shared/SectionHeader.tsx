import { Icon } from '@/components/shared/icons';
import { Text, View } from 'react-native';

interface Props {
  icon: string;
  label: string;
  colorClass: string;
  bgClass: string;
}

export function SectionHeader({ icon, label, colorClass, bgClass }: Props) {
  return (
    <View className="flex-row items-center gap-2 mb-2">
      <View className={`h-6 w-6 items-center justify-center rounded-full ${bgClass}`}>
        <Icon name={icon as never} sizeClassName="text-xs" className={colorClass} />
      </View>
      <Text className="text-xs font-bold uppercase tracking-wider text-muted">{label}</Text>
    </View>
  );
}
