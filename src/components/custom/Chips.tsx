import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import React from 'react';
import { ScrollView } from 'react-native';

export interface ChipsProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  data: { value: T; label: string }[];
  leftComponent?: () => React.ReactNode;
  rightComponent?: () => React.JSX.Element;
}

export const Chips = <T,>({
  onChange,
  value,
  data,
  leftComponent,
  rightComponent,
}: ChipsProps<T>) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={'gap-3 overflow-visible'}
      className="max-h-7"
      nestedScrollEnabled
      keyboardShouldPersistTaps={'handled'}>
      {leftComponent && leftComponent()}
      {data.map((item, index) => (
        <ChipItem
          key={item.label}
          title={item.label}
          state={JSON.stringify(item.value) === JSON.stringify(value)}
          onChange={(state) => state && onChange && onChange(item.value)}
          isFirst={index == 0 && !leftComponent}
          isLast={index == data.length - 1 && !rightComponent}
        />
      ))}
      {rightComponent && rightComponent()}
    </ScrollView>
  );
};

export interface ChipItemProps {
  state?: boolean;
  onChange?: (state: boolean) => void;
  title: string;
  isFirst: boolean;
  isLast: boolean;
}
export const ChipItem: React.FC<ChipItemProps> = ({ state, onChange, title, isFirst, isLast }) => {
  return (
    <Pressable
      className={`${isFirst ? 'ml-4' : isLast ? 'mr-4' : ''} ${state ? 'bg-primary-c_light' : 'bg-background-secondary'} rounded-full border-[0.5px] border-primary-border/10 px-4 py-v-1`}
      onPress={() => {
        const _value = !state;
        if (state) return;
        onChange && onChange(_value);
      }}>
      <Text
        className={`font-body text-sm font-normal ${state ? 'text-white' : 'text-typography-primary'}`}>
        {title}
      </Text>
    </Pressable>
  );
};
