import { FieldError, Select as HNSelect, useSelectAnimation } from 'heroui-native';
import { FC } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { BlurView } from '../BlurView';
import { SelectField as SelectFieldType } from './field';
import { Icon } from '../icons';

const StyleAnimatedView = withUniwind(Animated.View);

const AnimatedTrigger: FC<{ placeholder: string }> = ({ placeholder }) => {
  const { progress } = useSelectAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1, 2], [0, 1, 0]);
    return { opacity };
  });

  const rChevronStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1, 2], [0, -180, 0]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  return (
    <View
      className="bg-surface-secondary rounded-full h-v-10 w-full px-4 flex-row items-center shadow-md shadow-black/5"
      style={styles.borderCurve}>
      <StyleAnimatedView
        style={[rContainerStyle, styles.borderCurve]}
        className="absolute -inset-1 border border-accent rounded-full pointer-events-none"
      />
      <HNSelect.Value
        placeholder={placeholder}
        className="text-foreground text-sm flex-1"
        numberOfLines={1}
      />
      <StyleAnimatedView style={rChevronStyle} className="ml-2">
        <Icon name="ChevronDown" sizeClassName="text-sm" className="text-muted" />
      </StyleAnimatedView>
    </View>
  );
};

interface SelectFieldProps {
  control: Control;
  field: SelectFieldType;
  errors: FieldErrors;
  readonly?: boolean;
}

const SelectFieldComponent = ({ control, field, errors, readonly }: SelectFieldProps) => {
  const error = errors[field.name];
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default}
      render={({ field: { onChange, value, onBlur, ref } }) => {
        const _value = value;
        return (
          <HNSelect
            value={{
              value: _value,
              label: field.options.find((option) => option.value === _value)?.label || '',
            }}
            onValueChange={(v) => {
              onChange(v?.value);
            }}
            onBlur={onBlur}
            ref={ref}
            isDisabled={readonly}
            presentation="bottom-sheet">
            <View className="mb-2 ml-1 flex-row gap-1">
              <Text className="text-foreground text-sm font-medium">{field.label}</Text>
              {field.validation?.required && (
                <Text className="text-danger text-sm font-medium">*</Text>
              )}
            </View>
            <HNSelect.Trigger className="p-0">
              <AnimatedTrigger placeholder={field.placeholder || 'Choose an option'} />
            </HNSelect.Trigger>
            <HNSelect.Portal>
              <HNSelect.Overlay>
                <BlurView />
              </HNSelect.Overlay>
              <HNSelect.Content presentation="bottom-sheet">
                {field.help && <HNSelect.ListLabel>{field.help}</HNSelect.ListLabel>}
                {field.options.map((option) => (
                  <HNSelect.Item
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    className="border-[0.4px] border-border rounded-2xl mb-2"
                  />
                ))}
              </HNSelect.Content>
            </HNSelect.Portal>
            <FieldError isInvalid={!!error} className="text-xs font-medium text-danger mt-1 ml-1">
              {Array.isArray(error) ? error[0] : error?.message}
            </FieldError>
          </HNSelect>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: 'continuous',
  },
});

const SelectField = SelectFieldComponent;
export { SelectField };
