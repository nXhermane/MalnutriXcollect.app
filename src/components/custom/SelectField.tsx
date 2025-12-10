import { SelectField } from '@/utils/field';
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
import { AlertCircleIcon } from 'lucide-react-native';
import React from 'react';
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
import { ChevronDownIcon } from '../ui/icon';

interface SelectFieldComponentProps {
  field: SelectField;
  control: Control;
  errors: FieldErrors;
}

export function SelectFieldComponent({ field, control, errors }: SelectFieldComponentProps) {
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
          return (
            <Select
              onBlur={onBlur}
              ref={ref}
              selectedValue={value || field.default}
              onValueChange={onChange}>
              <SelectTrigger className=" h-v-10 justify-between rounded-lg border border-primary-border/5 data-[focus=true]:border-primary-c">
                <SelectInput
                  className=" font-body text-base font-normal"
                  placeholderClassName={'text-base font-body '}
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
                <SelectContent className={' max-h-[85vh]'}>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator className={'h-v-1 w-5 rounded-sm border-0'} />
                  </SelectDragIndicatorWrapper>
                  <SelectScrollView>
                    {field.options.map((item, index) => (
                      <SelectItem key={index} label={item.label} value={item.value} />
                    ))}
                  </SelectScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
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
