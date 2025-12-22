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
  readonly?: boolean;
}

export function RadioFieldComponent({
  field,
  control,
  errors,
  readonly,
}: RadioFieldComponentProps) {
  const error = errors[field.name];

  return (
    <FieldWrapper error={error} field={field} readonly={readonly}>
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
                  className={`h-v-10 flex-1 cursor-pointer items-center rounded-lg border border-border bg-input  p-3 transition-colors hover:bg-gray-50 `}>
                  <RadioIndicator className={`size-5 text-green-500   focus:ring-green-500`}>
                    <RadioIcon as={Circle} className="text-foreground" />
                  </RadioIndicator>
                  <RadioLabel className={'font-body text-sm text-foreground'}>
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
