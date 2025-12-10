import { DateField } from '@/utils/field';
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
import { AlertCircleIcon, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useValue } from '@legendapp/state/react';
import { isDark$ } from '@/store';
interface DateFieldComponentProps {
  field: DateField;
  control: Control;
  errors: FieldErrors;
}

export function DateFieldComponent({ field, control, errors }: DateFieldComponentProps) {
  const error = errors[field.name];
  const isDark = useValue(isDark$);
  const [visible, setVisible] = useState<boolean>(false);
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
        // defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <React.Fragment>
              <Input className=" h-v-10 rounded-lg border border-primary-border/5 data-[focus=true]:border-primary-c">
                <InputSlot className="flex-1">
                  <InputField
                    onBlur={onBlur}
                    ref={ref}
                    className="w-full flex-1"
                    type={'text'}
                    placeholderClassName={'text-base font-body text-typography-primary_light'}
                    placeholder={field.placeholder}
                    value={value || field.default.toISOString()}
                  />
                </InputSlot>
                <InputSlot onPress={() => setVisible(!visible)} className={'mr-2'}>
                  <InputIcon as={visible ? ChevronUp : ChevronDown} className={' size-5'} />
                </InputSlot>
              </Input>
              {visible && (
                <DateTimePicker
                  mode={field.mode}
                  themeVariant={isDark ? 'dark' : 'light'}
                  maximumDate={field.validation?.max}
                  minimumDate={field.validation?.min}
                  value={value}
                  onBlur={onBlur}
                  onChange={(event, _value) => {
                    if (_value) {
                      const date = new Date(_value);
                      if (field.mode === 'time') {
                        const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                        onChange(time);
                      } else {
                        onChange(date.toISOString().split('T')[0]);
                      }
                    }
                    setVisible(false);
                  }}
                />
              )}
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
