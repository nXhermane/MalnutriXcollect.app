import { Icon } from '@/components/shared/icons';
import { Surface } from 'heroui-native';
import { Text } from 'react-native';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  iconName?: string;
  accentClass?: string;
}

export function StatTile({ label, value, unit, iconName, accentClass }: Props) {
  return (
    <Surface variant="tertiary" className="flex-1 p-3 gap-1 min-w-28">
      {iconName && (
        <Icon
          name={iconName as never}
          sizeClassName="text-xs"
          className={accentClass ?? 'text-muted'}
        />
      )}
      <Text className="text-2xs text-muted">{label}</Text>
      <Text className={`text-sm font-bold ${accentClass ?? 'text-foreground'}`}>
        {value}
        {unit ? <Text className="text-2xs font-normal text-muted"> {unit}</Text> : null}
      </Text>
    </Surface>
  );
}
