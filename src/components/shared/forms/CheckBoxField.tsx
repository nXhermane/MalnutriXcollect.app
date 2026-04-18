import { Checkbox, ControlField, Description, FieldError, Label } from 'heroui-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { CheckBoxField as CheckBoxFieldType } from './field';

interface CheckBoxFieldProps {
  field: CheckBoxFieldType;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

const CheckBoxFieldComponent = ({ control, errors, field, readonly }: CheckBoxFieldProps) => {
  const error = errors[field.name];
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default}
      render={({ field: { value, onChange, onBlur } }) => (
        <ControlField
          isSelected={value}
          onSelectedChange={onChange}
          onBlur={onBlur}
          isInvalid={!!error}
          isDisabled={readonly}>
          <View className="w-full">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <Label className="text-sm font-medium text-foreground">{field.label}</Label>
                <Description className="text-xs text-muted mt-0.5 font-light">
                  {field.help}
                </Description>
              </View>
              <ControlField.Indicator>
                <Checkbox className="mt-1" />
              </ControlField.Indicator>
            </View>
            <FieldError className="mt-1 text-xs font-medium text-danger">
              {Array.isArray(error) ? error[0] : error?.message}
            </FieldError>
          </View>
        </ControlField>
      )}
    />
  );
};

const CheckBoxField = CheckBoxFieldComponent;
export { CheckBoxField };
