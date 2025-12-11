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
}: {
  field: Field;
  children: React.ReactNode;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}) {
  return (
    <FormControl
      className=" "
      isRequired={field.validation?.required}
      isReadOnly={field.readonly}
      isDisabled={field.disabled}
      isInvalid={!!error}>
      <FormControlLabel className="">
        <FormControlLabelText className="  font-body text-base  font-normal  text-gray-700 dark:text-gray-200 ">
          {field.label}
        </FormControlLabelText>
        {field.validation?.required && <FormControlLabelAstrick className="text-red-500" />}
      </FormControlLabel>
      {children}
      {field.help && (
        <FormControlHelper className="">
          <FormControlHelperText className="font-body  text-sm font-normal text-gray-500 dark:text-gray-400  ">
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
