import { Field } from '@/utils/field';
import React from 'react';
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
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export function FieldWrapper({
  children,
  field,
  error,
  readonly,
}: {
  field: Field;
  children: React.ReactNode;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  readonly?: boolean;
}) {
  return (
    <FormControl
      className=" "
      isRequired={field.validation?.required}
      isReadOnly={field.readonly || readonly}
      isDisabled={field.disabled}
      isInvalid={!!error}>
      <FormControlLabel className="">
        <FormControlLabelText className="  font-body text-base  font-normal text-foreground ">
          {field.label}
        </FormControlLabelText>
        {field.validation?.required && (
          <FormControlLabelAstrick className="ml-1 text-destructive">
            {/* <Text className="text-destructive">*</Text> */}
          </FormControlLabelAstrick>
        )}
      </FormControlLabel>
      {children}
      {field.help && (
        <FormControlHelper className="">
          <FormControlHelperText className="font-body  text-sm font-normal text-muted-foreground  ">
            {field.help}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      {error && (
        <FormControlError className="">
          <FormControlErrorIcon
            as={AlertCircleIcon}
            className="size-4 text-red-500 dark:text-red-400"
          />
          <FormControlErrorText className="font-body text-sm font-normal text-red-500 dark:text-red-400 ">
            {Array.isArray(error) ? error[0] : error?.message}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
