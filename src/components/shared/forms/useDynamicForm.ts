import { useCallback, useRef, useState } from 'react';
import { DynamicFromMethods } from './DynamicForm';

export function useDynamicFormHelpers() {
  const dynamicFromRef = useRef<DynamicFromMethods>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorInputCounter, setErrorInputCounter] = useState<number>(0);

  const props = {
    ref: dynamicFromRef,
    onError: (err: string | undefined) => setError(err),
    onSuccess: (state: boolean) => {
      setOnSuccess(state);
      if (state) dynamicFromRef.current?.reset({});
    },
    onLoading: (state: boolean) => setIsLoading(state),
    onFormIsValid: (state: boolean) => setIsFormValid(state),
    onInvalidInputCount: (counter: number) => setErrorInputCounter(counter),
  };

  const submit = useCallback(
    (...args: Parameters<NonNullable<DynamicFromMethods['submit']>>) =>
      dynamicFromRef.current?.submit(...args),
    [],
  );
  const reset = useCallback(
    (...args: Parameters<NonNullable<DynamicFromMethods['reset']>>) =>
      dynamicFromRef.current?.reset(...args),
    [],
  );

  return {
    props,
    submit,
    reset,
    loading: isLoading,
    error,
    success: onSuccess,
    formReady: !isFormValid,
    invalidInputCount: errorInputCounter,
  };
}
