import { DateField } from '@/utils/field';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { isDark$ } from '@/store';
// import { useValue } from '@legendapp/state/react';
import colors from 'tailwindcss/colors';
import { FieldWrapper } from './FieldWrapper';
interface DateFieldComponentProps {
  field: DateField;
  control: Control;
  errors: FieldErrors;
}

export function DateFieldComponent({ field, control, errors }: DateFieldComponentProps) {
  const error = errors[field.name];
  // const isDark = useValue(isDark$);
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <FieldWrapper error={error} field={field}>
      <Controller
        name={field.name}
        control={control}
        // defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <React.Fragment>
              <Input
                className={`h-v-10 w-full  rounded-lg  border border-gray-50 bg-background-100 px-2 py-3 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-green-500  dark:border-gray-600 dark:bg-background-100 dark:placeholder:text-gray-400`}>
                <InputSlot className="flex-1">
                  <InputField
                    onBlur={onBlur}
                    ref={ref}
                    className={'font-body text-sm font-normal text-typography-800 dark:text-white'}
                    placeholderClassName={'text-typography-600/60 font-body text-base  font-normal'}
                    cursorColor={colors.green[500]}
                    type={'text'}
                    placeholder={field.placeholder}
                    value={value || field.default.toISOString()}
                  />
                </InputSlot>
                <InputSlot onPress={() => setVisible(!visible)} className={'mr-2'}>
                  <InputIcon as={visible ? ChevronUp : ChevronDown} className={' size-5'} />
                </InputSlot>
              </Input>
              {visible &&
                // <DateTimePicker
                //   mode={field.mode}
                //   themeVariant={isDark ? 'dark' : 'light'}
                //   maximumDate={field.validation?.max}
                //   minimumDate={field.validation?.min}
                //   value={value}
                //   onBlur={onBlur}
                //   onChange={(event, _value) => {
                //     if (_value) {
                //       const date = new Date(_value);
                //       if (field.mode === 'time') {
                //         const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                //         onChange(time);
                //       } else {
                //         onChange(date.toISOString().split('T')[0]);
                //       }
                //     }
                //     setVisible(false);
                //   }}
                // />
                null}
            </React.Fragment>
          );
        }}
      />
    </FieldWrapper>
  );
}
