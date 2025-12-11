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
          const isVertical =
            field.options.length > 2 || field.options.some((opt) => opt.label.length > 10);
          return (
            <RadioGroup
              value={(value as string) || field.default}
              className={`${isVertical ? 'flex flex-col ' : 'flex-row justify-between gap-5'}`}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}>
              {field.options.map((item, index) => (
                <Radio
                  key={index}
                  value={item.value}
                  className={`h-v-10 flex-1 cursor-pointer items-center rounded-lg border border-gray-300 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-background-100 dark:hover:bg-gray-700`}>
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
