import { TextField } from '@/utils/field';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { Input, InputField } from '../ui/input';
import { Textarea, TextareaInput } from '../ui/textarea';
import { FieldWrapper } from './FieldWrapper';

interface TextFieldComponentProps {
  field: TextField;
  control: Control;
  errors: FieldErrors;
  readonly?: boolean;
}

export function TextFieldComponent({ field, control, errors, readonly }: TextFieldComponentProps) {
  const error = errors[field.name];
  return (
    <FieldWrapper field={field} error={error} readonly={readonly}>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.default || ''}
        render={({ field: { onChange, onBlur, value, ref } }) =>
          field.mode === 'textarea' ? (
            <Textarea
              className={`min-h-[120px] w-full resize-y  rounded-lg  border-border bg-input p-2 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-emerald-500 `}>
              <TextareaInput
                id={field.name}
                ref={ref}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={field.placeholder}
                readOnly={field.readonly}
                className={'font-body text-sm font-normal text-foreground'}
                placeholderClassName={'text-muted-foreground font-body text-base  font-normal'}
                cursorColor={colors.green[500]}
              />
            </Textarea>
          ) : (
            <Input
              className={`h-v-10 w-full rounded-lg border  border-border bg-input  px-2 py-3 transition-colors focus:border-transparent focus:outline-none   focus:ring-green-500 data-[focus=true]:border-emerald-500   `}>
              <InputField
                id={field.name}
                ref={ref}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={field.placeholder}
                readOnly={field.readonly}
                className={'font-body text-sm font-normal text-foreground'}
                placeholderClassName={'text-muted-foreground font-body text-base  font-normal'}
                cursorColor={colors.green[500]}
              />
            </Input>
          )
        }
      />
    </FieldWrapper>
  );
}
