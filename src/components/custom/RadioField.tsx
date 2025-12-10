import { RadioField } from '@/utils/field';
import { Circle } from 'lucide-react-native';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '../ui/radio';
import { FieldWrapper } from './FieldWrapper';

interface RadioFieldComponentProps {
  field: RadioField;
  control: Control;
  errors: FieldErrors;
}

export function RadioFieldComponent({ field, control, errors }: RadioFieldComponentProps) {
  const error = errors[field.name];

  return (
    <FieldWrapper error={error} field={field}>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <RadioGroup
              value={(value as string) || field.default}
              className={`flex flex-col gap-2 pt-3`}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}>
              {field.options.map((item, index) => (
                <Radio
                  key={index}
                  value={item.value}
                  className={`flex h-v-10 cursor-pointer items-center rounded-lg border border-gray-300 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-background-100 dark:hover:bg-gray-700`}>
                  <RadioIndicator className={`size-5 text-green-500   focus:ring-green-500`}>
                    <RadioIcon as={Circle} className="" />
                  </RadioIndicator>
                  <RadioLabel className={'font-body text-sm  text-gray-700 dark:text-gray-200'}>
                    {item.label}
                  </RadioLabel>
                </Radio>
              ))}
            </RadioGroup>
          );
        }}
      />
    </FieldWrapper>
  );
}
