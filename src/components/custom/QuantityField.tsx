import { QuantityField } from '@/utils/field';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { HStack } from '../ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
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
import { Text } from '../ui/text';
import { FieldWrapper } from './FieldWrapper';

interface QuantityFieldComponentProps {
  field: QuantityField;
  control: Control;
  errors: FieldErrors;
}

export function QuantityFieldComponent({ field, control, errors }: QuantityFieldComponentProps) {
  const error = errors[field.name];
  return (
    <FieldWrapper field={field} error={error}>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          const quantityValue = value || field.default;
          return (
            <React.Fragment>
              <Input
                className={`h-v-10  w-full rounded-lg border  border-gray-50  bg-background-100 p-0  transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-green-500 dark:border-gray-600 dark:bg-background-100 dark:placeholder:text-gray-400`}>
                <InputField
                  type={'text'}
                  placeholder={field.placeholder}
                  keyboardType={'numeric'}
                  value={quantityValue.value}
                  onChangeText={(val) =>
                    onChange({
                      ...quantityValue,
                      value: value,
                    })
                  }
                  onBlur={onBlur}
                  ref={ref}
                  className={
                    ' h-full px-4 py-3  font-body text-sm font-normal text-typography-800 dark:text-white'
                  }
                  placeholderClassName={'text-typography-600/60 font-body text-base  font-normal'}
                  cursorColor={colors.green[500]}
                />
                <InputSlot className={'h-full w-20 '}>
                  <Select
                    defaultValue={quantityValue.unit}
                    onValueChange={(val) =>
                      onChange({
                        ...quantityValue,
                        unit: val,
                      })
                    }
                    className={'size-full '}>
                    <SelectTrigger className={'size-full  border-0'}>
                      <HStack className={'size-full items-center justify-end gap-1 pr-2'}>
                        <Text className={'font-light text-sm'}>
                          {
                            field.unitOptions.find((unit) => unit.value === quantityValue.unit)
                              ?.label
                          }
                        </Text>
                        <InputIcon as={ChevronDown} className={' size-4'} />
                      </HStack>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent
                        className={' max-h-[85vh] bg-background-0 dark:bg-background-50 '}>
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
                                className: `font-body font-normal `,
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
    </FieldWrapper>
  );
}
