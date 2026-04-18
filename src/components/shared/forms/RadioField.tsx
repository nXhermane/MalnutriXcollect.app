import { FieldError, Label, Radio, RadioGroup } from 'heroui-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { RadioField as RadioFieldType } from './field';

interface RadioFieldProps {
  field: RadioFieldType;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

const RadioFieldComponent = ({ field, control, errors, readonly }: RadioFieldProps) => {
  const error = errors[field.name];

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default}
      render={({ field: { onChange, value } }) => (
        <View>
          <View className="mb-2 ml-1 flex-row gap-1">
            <Text className="text-foreground text-sm font-medium">{field.label}</Text>
            {field.validation?.required && (
              <Text className="text-danger text-sm font-medium">*</Text>
            )}
          </View>
          <RadioGroup
            value={String(value)}
            isDisabled={readonly}
            onValueChange={onChange}
            isInvalid={!!error}
            className="px-0 flex-row gap-3">
            {field.options.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
                className="flex-1 justify-normal gap-1.5 p-2 rounded-full">
                <Radio />
                <Label className="text-sm">{option.label}</Label>
              </RadioGroup.Item>
            ))}
            <FieldError className="text-xs font-medium text-danger mt-1">
              {Array.isArray(error) ? error[0] : error?.message}
            </FieldError>
          </RadioGroup>
          {field.help && (
            <Text className="text-muted text-xs mt-1 ml-1 font-light">{field.help}</Text>
          )}
        </View>
      )}
    />
  );
};

const RadioField = RadioFieldComponent;
export { RadioField };
