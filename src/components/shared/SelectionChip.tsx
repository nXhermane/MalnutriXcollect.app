import { PressableFeedback, PressableFeedbackProps, Surface } from 'heroui-native';
import React from 'react';
import { ScrollView, Text } from 'react-native';

export interface SelectionChipsProps<T extends string> {
  value?: T;
  onChange?: (value: T) => void;
  data: { value: T; label: string }[];
  chipItem?: (props: { isActive: boolean; item: { label: string; value: T } }) => React.ReactNode;
  leftComponent?: () => React.ReactNode;
  rightComponent?: () => React.JSX.Element;
  chipContainerProps?: (props: {
    isActive: boolean;
    item: { label: string; value: T };
  }) => PressableFeedbackProps;
}

export const SelectionChips = <T extends string>({
  onChange,
  value,
  data,
  leftComponent,
  rightComponent,
  chipItem,
  chipContainerProps,
}: SelectionChipsProps<T>) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={'gap-3 overflow-visible items-center'}
      className="max-h-v-8"
      nestedScrollEnabled>
      {leftComponent && leftComponent()}
      {data.map((item, index) => (
        <SelectionChipItem
          key={item.value}
          item={item}
          isActive={item.value === value}
          onChange={(state) => state && onChange && onChange(item.value)}
          isFirst={index === 0 && !leftComponent}
          isLast={index === data.length - 1 && !rightComponent}
          containerProps={
            chipContainerProps && chipContainerProps({ isActive: item.value === value, item })
          }>
          {chipItem && chipItem({ isActive: item.value === value, item })}
        </SelectionChipItem>
      ))}
      {rightComponent && rightComponent()}
    </ScrollView>
  );
};

interface SelectionChipItemProps<T extends string> {
  isActive: boolean;
  onChange?: (state: boolean) => void;
  item: { label: string; value: T };
  isFirst: boolean;
  isLast: boolean;
  children?: React.ReactNode;
  containerProps?: PressableFeedbackProps;
}
const SelectionChipItem = <T extends string>({
  isActive,
  onChange,
  item,
  isFirst,
  isLast,
  children,
  containerProps,
}: SelectionChipItemProps<T>) => {
  return (
    <PressableFeedback
      onPress={() => {
        const _value = !isActive;
        if (isActive) return;
        if (onChange) onChange(_value);
      }}
      className={`${isFirst ? 'ml-4' : isLast ? 'mr-4' : ''}`}
      {...containerProps}>
      {children && children}
      {!children && (
        <Surface className={`${isActive ? 'bg-accent' : 'bg-surface'} rounded-full  px-4 py-1`}>
          <Text className={`font-body text-sm  ${isActive ? 'text-white' : 'text-muted'}`}>
            {item.label}
          </Text>
        </Surface>
      )}
    </PressableFeedback>
  );
};
