import { DateField } from '@/utils/field';
import React, { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Input, InputField, InputSlot } from '../ui/input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { isDark$ } from '@/store';
import { useValue } from '@legendapp/state/react';
import colors from 'tailwindcss/colors';
import { FieldWrapper } from './FieldWrapper';
interface DateFieldComponentProps {
  field: DateField;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

export function DateFieldComponent({ field, control, errors, readonly }: DateFieldComponentProps) {
  const error = errors[field.name];
  const isDark = useValue(isDark$);
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <FieldWrapper error={error} field={field} readonly={readonly}>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default.toISOString().slice(0, 16)}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <React.Fragment>
              <Input
                isReadOnly={true}
                className={`h-v-10 w-full  rounded-lg  border border-border bg-input  px-2 py-3 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-green-500  `}>
                <InputSlot className="flex-1" onPress={() => setVisible(!visible)}>
                  <InputField
                    onBlur={onBlur}
                    ref={ref}
                    className={'font-body text-sm font-normal text-foreground'}
                    placeholderClassName={'text-muted-foreground font-body text-base  font-normal'}
                    cursorColor={colors.green[500]}
                    type={'text'}
                    placeholder={field.placeholder}
                    value={new Date(value || field.default).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    readOnly={true}
                  />
                </InputSlot>
              </Input>
              {visible && (
                <DateTimePicker
                  mode={field.mode}
                  themeVariant={isDark ? 'dark' : 'light'}
                  maximumDate={field.validation?.max}
                  minimumDate={field.validation?.min}
                  value={new Date(value || field.default)}
                  onBlur={onBlur}
                  onChange={(event, _value) => {
                    if (_value) {
                      const date = new Date(_value);
                      if (field.mode === 'time') {
                        const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                        onChange(time);
                      } else {
                        const dateStr = date.toISOString();
                        onChange(dateStr.slice(0, dateStr.lastIndexOf(':')));
                      }
                    }
                    setVisible(false);
                  }}
                  display="inline"
                />
              )}
            </React.Fragment>
          );
        }}
      />
    </FieldWrapper>
  );
}
