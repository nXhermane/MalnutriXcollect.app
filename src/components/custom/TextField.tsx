import { TextField } from '@/utils/field';
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
import { Input, InputField } from '../ui/input';
import { Textarea, TextareaInput } from '../ui/textarea';
import { AlertCircleIcon } from 'lucide-react-native';

interface TextFieldComponentProps {
  field: TextField;
  control: Control;
  errors: FieldErrors;
}

export function TextFieldComponent({ field, control, errors }: TextFieldComponentProps) {
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
        render={({ field: { onChange, onBlur, value, ref } }) =>
          field.mode === 'textarea' ? (
            <Textarea>
              <TextareaInput
                id={field.name}
                ref={ref}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={field.placeholder}
                readOnly={field.readonly}
              />
            </Textarea>
          ) : (
            <Input>
              <InputField
                id={field.name}
                ref={ref}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={field.placeholder}
                readOnly={field.readonly}
              />
            </Input>
          )
        }
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
