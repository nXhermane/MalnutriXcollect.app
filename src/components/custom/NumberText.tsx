import { NumberField } from '@/utils/field';
import { FieldErrors, Controller, Control } from 'react-hook-form';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
} from '../ui/form-control';
import { Input, InputField } from '../ui/input';
import { AlertCircleIcon } from 'lucide-react-native';
import { useCallback } from 'react';

interface NumberFieldComponentProps {
  field: NumberField;
  control: Control;
  errors: FieldErrors;
}

export function NumberFieldComponent({ field, control, errors }: NumberFieldComponentProps) {
  const error = errors[field.name];
  const parseNumberFromString = (str: string): number => {
    return Number(str.replace(/,/g, '.'));
  };

  const formatNumberWithComma = (num: number): string => {
    return num.toString().replace(/\./g, ',');
  };

  const handleNumberInput = useCallback(
    (val: string) => {
      const num = parseNumberFromString(val);
      if (field.validation?.min !== undefined) {
        if (num <= field.validation.min) {
          return field.validation.min;
        }
      }
      if (field.validation?.max !== undefined) {
        if (num >= field.validation.max) {
          return field.validation.max;
        }
      }
      return num;
    },
    [field.validation],
  );

  return (
    <FormControl
      className="mb-4"
      isRequired={field.validation?.required}
      isReadOnly={field.readonly}
      isDisabled={field.disabled}>
      <FormControlLabel className="mb-2 block text-gray-700">
        <FormControlLabelText>{field.label}</FormControlLabelText>
        {field.validation?.required && <FormControlLabelAstrick />}
      </FormControlLabel>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input>
            <InputField
              id={field.name}
              ref={ref}
              value={formatNumberWithComma(value || '')}
              onChangeText={(val) => onChange(handleNumberInput(val))}
              onBlur={onBlur}
              placeholder={field.placeholder}
              readOnly={field.readonly}
              keyboardType="numeric"
            />
          </Input>
        )}
      />
      {field.help && (
        <FormControlHelper>
          <FormControlHelperText className="mt-1 text-sm text-gray-500">
            {field.help}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
          <FormControlErrorText className="text-red-500">
            {error.message?.toString()}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
