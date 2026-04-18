import { toDatetime } from '@/lib/utils/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Description,
  FieldError,
  TextField as HNTextField,
  Input,
  Label,
  PressableFeedback,
} from 'heroui-native';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { DateField as DateFieldType } from './field';

interface DateFieldProps {
  field: DateFieldType;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

const DateFieldComponent = ({ field, control, errors, readonly }: DateFieldProps) => {
  const error = errors[field.name];
  const [visible, setVisible] = React.useState<boolean>(false);

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.default ? field.default.toISOString().slice(0, 16) : undefined}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <>
          <HNTextField
            isDisabled={readonly}
            isInvalid={!!error}
            isRequired={field.validation?.required}>
            <Label className="text-foreground text-sm font-medium">{field.label}</Label>
            <PressableFeedback onPress={() => setVisible(!visible)}>
              <Input
                placeholder={field.placeholder}
                defaultValue={new Date().toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
                value={
                  value
                    ? new Date(value).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : undefined
                }
                onBlur={onBlur}
                className="text-center font-medium text-foreground text-sm"
                ref={ref}
                readOnly={true}
              />
            </PressableFeedback>
            {field.help && (
              <Description className="text-xs text-muted font-light">{field.help}</Description>
            )}
            <FieldError className="text-xs font-medium text-danger" isInvalid={!!error}>
              {Array.isArray(error) ? error[0] : error?.message}
            </FieldError>
          </HNTextField>
          {visible && (
            <DateTimePicker
              mode={field.mode}
              maximumDate={field.validation?.max}
              minimumDate={field.validation?.min}
              value={new Date(value || field.default || new Date())}
              onBlur={onBlur}
              onChange={(_, _value) => {
                if (_value) {
                  const date = new Date(_value);
                  if (field.mode === 'time') {
                    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    onChange(time);
                  } else {
                    onChange(toDatetime(date));
                  }
                }
                setVisible(false);
              }}
              display="inline"
            />
          )}
        </>
      )}
    />
  );
};

const DateField = DateFieldComponent;
export { DateField };
