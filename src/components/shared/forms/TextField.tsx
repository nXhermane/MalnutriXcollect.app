import { Description, FieldError, TextField as HNTextField, Label } from 'heroui-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { SmartInput } from '../SmartInput';
import { TextField as TextFieldType } from './field';

export interface TextFieldProps {
  control: Control;
  field: TextFieldType;
  errors: FieldErrors;
  readonly?: boolean;
}

const TextFieldComponent = ({ control, field, errors, readonly }: TextFieldProps) => {
  const error = errors[field.name];
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <HNTextField
          isDisabled={readonly}
          isInvalid={!!error}
          isRequired={field.validation?.required}>
          <Label className="text-foreground text-sm font-medium">{field.label}</Label>
          <SmartInput
            keyboardType={field.keyboardType}
            multiline={field.mode === 'textarea'}
            placeholder={field.placeholder}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
            readOnly={readonly}
          />
          {field.help && (
            <Description className="text-xs text-muted font-light">{field.help}</Description>
          )}
          <FieldError isInvalid={!!error} className="text-xs font-medium text-danger">
            {Array.isArray(error) ? error[0] : error?.message}
          </FieldError>
        </HNTextField>
      )}
    />
  );
};

const TextField = TextFieldComponent;
export { TextField };
