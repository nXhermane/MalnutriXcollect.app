import {
  Description,
  FieldError,
  Select as HNSelect,
  TextField as HNTextField,
  Label,
  useSelectAnimation,
} from 'heroui-native';
import { FC } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { BlurView } from '../BlurView';
import { SmartInput } from '../SmartInput';
import { QuantityField as QuantifyFieldType } from './field';
import { Icon } from '../icons';

const StyleAnimatedView = withUniwind(Animated.View);

const AnimatedTrigger: FC = () => {
  const { progress } = useSelectAnimation();

  const rChevronStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1, 2], [0, -180, 0]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  return (
    <View className="flex-row items-center gap-1 rounded-xl flex-1 px-1 justify-between">
      <HNSelect.Value placeholder="" className="text-sm w-[80%] text-right" numberOfLines={1} />
      <StyleAnimatedView style={rChevronStyle}>
        <Icon name="ChevronDown" sizeClassName="text-sm" className="text-muted" />
      </StyleAnimatedView>
    </View>
  );
};

interface QuantityFieldProps {
  field: QuantifyFieldType;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

const QuantifyFieldComponent = ({ field, control, errors, readonly }: QuantityFieldProps) => {
  const error = errors[field.name];
  return (
    <Controller
      control={control}
      name={field.name}
      defaultValue={field.default}
      render={({ field: { onChange, value, onBlur, ref } }) => {
        const quantityValue = value;
        return (
          <HNTextField
            isDisabled={readonly}
            isInvalid={!!error}
            isRequired={field.validation?.required}>
            <Label className="text-foreground text-sm font-medium">{field.label}</Label>
            <View>
              <SmartInput
                placeholder={field.placeholder}
                keyboardType={'numeric'}
                defaultValue={quantityValue.value.toString()}
                value={quantityValue.value.toString()}
                onChangeText={(val) => onChange({ ...quantityValue, value: val })}
                onBlur={onBlur}
                className="px-0 pl-2 pr-20"
                ref={ref}
                readOnly={readonly}
              />
              <View className="absolute right-0 w-24 -mr-1 h-full">
                <HNSelect
                  defaultValue={{
                    value: field.default.unit,
                    label:
                      field.unitOptions.find((option) => option.value === field.default.unit)
                        ?.label || '',
                  }}
                  value={{
                    value: quantityValue.unit,
                    label:
                      field.unitOptions.find((option) => option.value === quantityValue.unit)
                        ?.label || '',
                  }}
                  onValueChange={(val) => onChange({ ...quantityValue, unit: val?.value })}
                  onBlur={onBlur}
                  isDisabled={readonly}
                  presentation="bottom-sheet">
                  <HNSelect.Trigger className="h-full w-full p-0">
                    <AnimatedTrigger />
                  </HNSelect.Trigger>
                  <HNSelect.Portal>
                    <HNSelect.Overlay>
                      <BlurView />
                    </HNSelect.Overlay>
                    <HNSelect.Content presentation="bottom-sheet">
                      {field.unitOptions.map((option) => (
                        <HNSelect.Item
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          className="border-[0.4px] border-border rounded-2xl mb-2"
                        />
                      ))}
                    </HNSelect.Content>
                  </HNSelect.Portal>
                </HNSelect>
              </View>
            </View>
            {field.help && (
              <Description className="text-xs text-muted font-light">{field.help}</Description>
            )}
            <FieldError isInvalid={!!error} className="text-xs font-medium text-danger">
              {Array.isArray(error) ? error[0] : error?.message}
            </FieldError>
          </HNTextField>
        );
      }}
    />
  );
};

const QuantifyField = QuantifyFieldComponent;
export { QuantifyField };
