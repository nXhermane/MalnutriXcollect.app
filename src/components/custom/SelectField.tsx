import { SelectField } from '@/utils/field';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { ChevronDownIcon } from '../ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from '../ui/select';
import { FieldWrapper } from './FieldWrapper';

interface SelectFieldComponentProps {
  field: SelectField;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

export function SelectFieldComponent({
  field,
  control,
  errors,
  readonly,
}: SelectFieldComponentProps) {
  const error = errors[field.name];

  return (
    <FieldWrapper field={field} error={error} readonly={readonly}>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <Select
              onBlur={onBlur}
              ref={ref}
              selectedValue={value || field.default}
              onValueChange={onChange}>
              <SelectTrigger
                className={`h-v-10 w-full justify-between  rounded-lg   border border-border bg-input  px-2 py-3 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-emerald-500 `}>
                <SelectInput
                  className={'font-body text-sm font-normal text-foreground'}
                  placeholderClassName={'text-muted-foreground font-body text-base  font-normal'}
                  cursorColor={colors.green[500]}
                  placeholder={field.placeholder}
                  value={
                    field.options.find(
                      (item) => item.value === value || (!value && item.value === field.default),
                    )?.label
                  }
                />
                <SelectIcon as={ChevronDownIcon} className={' mr-2 size-5'} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className={' max-h-[85vh] bg-background-muted '}>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator className={'h-v-1 w-5 rounded-sm border-0'} />
                  </SelectDragIndicatorWrapper>
                  <SelectScrollView>
                    {field.options.map((item, index) => (
                      <SelectItem
                        className={`rounded-lg`}
                        textStyle={{
                          className: `font-body font-normal text-foreground `,
                        }}
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </SelectScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
          );
        }}
      />
    </FieldWrapper>
  );
}
