import { CheckBoxField } from '@/utils/field';
import { CheckIcon } from 'lucide-react-native';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '../ui/checkbox';
import { FieldWrapper } from './FieldWrapper';

interface CheckBoxFieldComponentProps {
  field: CheckBoxField;
  control: Control;
  errors: FieldErrors;
}

export function CheckBoxFieldComponent({ field, control, errors }: CheckBoxFieldComponentProps) {
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
            <CheckboxGroup
              onBlur={onBlur}
              ref={ref}
              value={(value as string[]) || field.default}
              className={`${isVertical ? 'flex flex-col gap-2' : 'flex-row gap-5'}`}
              onChange={onChange}>
              {field.options.map((item, index) => (
                <Checkbox
                  key={index}
                  value={item.value}
                  className={`flex h-v-10 cursor-pointer items-center rounded-lg border border-border  bg-input p-3 transition-colors hover:bg-gray-50 `}>
                  <CheckboxIndicator className={' size-5 text-green-500 focus:ring-green-500'}>
                    <CheckboxIcon as={CheckIcon} className="text-foreground" />
                  </CheckboxIndicator>
                  <CheckboxLabel className="font-body text-sm text-foreground">
                    {item.label}
                  </CheckboxLabel>
                </Checkbox>
              ))}
            </CheckboxGroup>
          );
        }}
      />
    </FieldWrapper>
  );
}
