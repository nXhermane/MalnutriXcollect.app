import { QuantityField } from '@/utils/field';
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
import React, { useCallback } from 'react';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from '../ui/select';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';

interface QuantityFieldComponentProps {
  field: QuantityField;
  control: Control;
  errors: FieldErrors;
}

export function QuantityFieldComponent({ field, control, errors }: QuantityFieldComponentProps) {
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
        render={({ field: { onChange, onBlur, value, ref } }) => {
          const quantityValue = value || field.default;
          return (
            <React.Fragment>
              <Input className=" h-v-10 rounded-lg border border-primary-border/5 data-[focus=true]:border-primary-c">
                <InputField
                  type={'text'}
                  className=" font-body text-base font-normal"
                  placeholderClassName={'text-base font-body '}
                  placeholder={field.placeholder}
                  keyboardType={'numeric'}
                  value={formatNumberWithComma(quantityValue.value)}
                  onChangeText={(val) =>
                    onChange({
                      ...quantityValue,
                      value: handleNumberInput(val),
                    })
                  }
                  onBlur={onBlur}
                  ref={ref}
                />
                <InputSlot className={'h-full w-20'}>
                  <Select
                    defaultValue={quantityValue.unit}
                    onValueChange={(val) =>
                      onChange({
                        ...quantityValue,
                        unit: val,
                      })
                    }
                    className={'size-full border border-primary-border/5'}>
                    <SelectTrigger className={'size-full border-0'}>
                      <HStack className={'size-full items-center justify-end gap-1 pr-2'}>
                        <Text className={'font-light text-sm'}></Text>
                        <InputIcon className={' size-4'} />
                      </HStack>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent className={' max-h-[85vh]'}>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator className={'h-v-1 w-5 rounded-sm border-0'} />
                        </SelectDragIndicatorWrapper>
                        <SelectScrollView>
                          {field.unitOptions.map((item, index) => (
                            <SelectItem
                              key={index}
                              label={item.label}
                              value={item.value}
                              className={`rounded-lg`}
                              textStyle={{
                                className: `font-body font-normal text-typography-primary`,
                              }}
                            />
                          ))}
                        </SelectScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </InputSlot>
              </Input>
            </React.Fragment>
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
