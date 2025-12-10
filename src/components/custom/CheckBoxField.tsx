import { CheckBoxField } from '@/utils/field';
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
import { AlertCircleIcon, CheckIcon } from 'lucide-react-native';
import React from 'react';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '../ui/checkbox';

interface CheckBoxFieldComponentProps {
  field: CheckBoxField;
  control: Control;
  errors: FieldErrors;
}

export function CheckBoxFieldComponent({ field, control, errors }: CheckBoxFieldComponentProps) {
  const error = errors[field.name];

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
        render={({ field: { onChange, onBlur, value, ref } }) => {
          const isVertical =
            field.options.length > 2 || field.options.some((opt) => opt.label.length > 10);
          return (
            <CheckboxGroup
              onBlur={onBlur}
              ref={ref}
              value={(value as string[]) || field.default}
              className={`${isVertical ? 'flex flex-col gap-2' : 'flex-row gap-5'}`}
              onChange={onChange}>
              {field.options.map((item, index) => (
                <Checkbox key={index} value={item.value}>
                  <CheckboxIndicator className={' size-4'}>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{item.label}</CheckboxLabel>
                </Checkbox>
              ))}
            </CheckboxGroup>
          );
        }}
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
