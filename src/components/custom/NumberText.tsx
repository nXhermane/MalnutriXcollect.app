import { NumberField } from '@/utils/field';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { Input, InputField } from '../ui/input';
import { FieldWrapper } from './FieldWrapper';

interface NumberFieldComponentProps {
  field: NumberField;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

export function NumberFieldComponent({
  field,
  control,
  errors,
  readonly,
}: NumberFieldComponentProps) {
  const error = errors[field.name];

  return (
    <FieldWrapper error={error} field={field} readonly={readonly}>
      <Controller
        name={field.name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            isReadOnly={readonly}
            className={`h-v-10 w-full  rounded-lg  border border-border  bg-input px-2 py-3 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-green-500 `}>
            <InputField
              id={field.name}
              ref={ref}
              value={value}
              defaultValue={field.default?.toString()}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={field.placeholder}
              keyboardType="numeric"
              className={'font-body text-sm font-normal text-foreground'}
              placeholderClassName={'text-muted-foreground font-body text-base  font-normal'}
              cursorColor={colors.green[500]}
            />
          </Input>
        )}
      />
    </FieldWrapper>
  );
}
