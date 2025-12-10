import { NumberField } from '@/utils/field';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { Input, InputField } from '../ui/input';
import { FieldWrapper } from './FieldWrapper';

interface NumberFieldComponentProps {
  field: NumberField;
  control: Control;
  errors: FieldErrors;
}

export function NumberFieldComponent({ field, control, errors }: NumberFieldComponentProps) {
  const error = errors[field.name];

  return (
    <FieldWrapper error={error} field={field}>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            className={`h-v-10 w-full  rounded-lg  border border-gray-50 bg-background-100 px-2 py-3 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-green-500 dark:border-gray-600 dark:bg-background-100 dark:placeholder:text-gray-400`}>
            <InputField
              id={field.name}
              ref={ref}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={field.placeholder}
              readOnly={field.readonly}
              keyboardType="numeric"
              className={'font-body text-sm font-normal text-typography-800 dark:text-white'}
              placeholderClassName={'text-typography-600/60 font-body text-base  font-normal'}
              cursorColor={colors.green[500]}
            />
          </Input>
        )}
      />
    </FieldWrapper>
  );
}
