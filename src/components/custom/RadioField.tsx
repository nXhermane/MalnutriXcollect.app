import { RadioField } from '@/utils/field';
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
import { AlertCircleIcon, Circle } from 'lucide-react-native';
import React from 'react';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '../ui/radio';

interface RadioFieldComponentProps {
  field: RadioField;
  control: Control;
  errors: FieldErrors;
}

export function RadioFieldComponent({ field, control, errors }: RadioFieldComponentProps) {
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
            <RadioGroup
              value={(value as string) || field.default}
              className={`pt-3 ${isVertical ? 'flex flex-col gap-2' : 'flex-row gap-5'}`}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}>
              {field.options.map((item, index) => (
                <Radio key={index} value={item.value} className="">
                  <RadioIndicator className={`size-4 `}>
                    <RadioIcon as={Circle} className="" />
                  </RadioIndicator>
                  <RadioLabel className={'font-body text-sm text-typography-0'}>
                    {item.label}
                  </RadioLabel>
                </Radio>
              ))}
            </RadioGroup>
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
