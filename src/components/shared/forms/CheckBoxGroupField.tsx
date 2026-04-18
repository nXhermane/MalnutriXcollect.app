import { Checkbox, ControlField, FieldError, Label, Surface } from 'heroui-native';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { CheckBoxGroupField as CheckBoxGroupFieldType } from './field';

interface InlineFilterProps {
  isSelected: boolean;
  onSelectedChange: (value: boolean) => void;
  label: string;
  readonly?: boolean;
}

const InlineFilter: React.FC<InlineFilterProps> = ({
  isSelected,
  onSelectedChange,
  label,
  readonly,
}) => (
  <ControlField
    isSelected={isSelected}
    onSelectedChange={onSelectedChange}
    className="gap-2"
    isDisabled={readonly}>
    <ControlField.Indicator>
      <Checkbox className="size-5 rounded-md" />
    </ControlField.Indicator>
    <Label>{label}</Label>
  </ControlField>
);

interface CheckBoxGroupFieldProps {
  field: CheckBoxGroupFieldType;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

const CheckBoxGroupFieldComponent = ({
  field,
  control,
  errors,
  readonly,
}: CheckBoxGroupFieldProps) => {
  const error = errors[field.name];

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default}
      render={({ field: { onChange, value } }) => {
        const _value = value || [];
        return (
          <Surface className="px-0">
            <View className="mb-2 flex-row gap-1">
              <Text className="text-foreground text-sm font-medium">
                {field.label}{' '}
                {field.validation?.required && (
                  <Text className="text-danger text-sm font-medium">*</Text>
                )}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {field.options.map((option) => (
                <InlineFilter
                  key={option.value}
                  isSelected={_value.includes(option.value)}
                  onSelectedChange={(selected) => {
                    if (selected) {
                      onChange([..._value, option.value]);
                    } else {
                      onChange(_value.filter((v: string) => v !== option.value));
                    }
                  }}
                  label={option.label}
                  readonly={readonly}
                />
              ))}
            </View>
            {field.help && <Text className="text-muted text-xs mt-1 font-light">{field.help}</Text>}
            <FieldError isInvalid={!!error} className="text-xs font-medium text-danger mt-1">
              {Array.isArray(error) ? error[0] : error?.message}
            </FieldError>
          </Surface>
        );
      }}
    />
  );
};

const CheckBoxGroupField = CheckBoxGroupFieldComponent;
export { CheckBoxGroupField };
