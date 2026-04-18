import { Description, FieldError, Label, TextField } from 'heroui-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { SmartInput } from '../SmartInput';
import { NumberField as NumberFieldType } from './field';

export interface NumberFieldProps {
  control: Control;
  field: NumberFieldType;
  errors: FieldErrors;
  readonly?: boolean;
}

const NumberFieldComponent = ({ control, field, errors, readonly }: NumberFieldProps) => {
  const error = errors[field.name];
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default ? String(field.default) : undefined}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <TextField
          isDisabled={readonly}
          isInvalid={!!error}
          isRequired={field.validation?.required}>
          <Label className="text-foreground text-sm font-medium">{field.label}</Label>
          <SmartInput
            ref={ref}
            placeholder={field.placeholder}
            onChangeText={onChange}
            keyboardType={'numeric'}
            onBlur={onBlur}
            value={value}
            readOnly={readonly}
          />
          {field.help && (
            <Description className="text-xs text-muted font-light">{field.help}</Description>
          )}
          <FieldError isInvalid={!!error} className="text-xs font-medium text-danger">
            {Array.isArray(error) ? error[0] : error?.message}
          </FieldError>
        </TextField>
      )}
    />
  );
};

const NumberField = NumberFieldComponent;
export { NumberField };
