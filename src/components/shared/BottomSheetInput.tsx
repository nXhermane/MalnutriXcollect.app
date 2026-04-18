import { Input, InputProps, useBottomSheetAwareHandlers } from 'heroui-native';

export function BottomSheetInput({ children, ...props }: InputProps) {
  const { onBlur, onFocus } = useBottomSheetAwareHandlers();

  return (
    <Input {...props} onFocus={onFocus} onBlur={onBlur}>
      {children}
    </Input>
  );
}
