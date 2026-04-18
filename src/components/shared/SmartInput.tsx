import { useBottomSheet } from '@gorhom/bottom-sheet';
import { Input, InputProps } from 'heroui-native';
import { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { BottomSheetInput } from './BottomSheetInput';

export const SmartInput = forwardRef((props: InputProps, ref: React.Ref<TextInput>) => {
  let isInsideBottomSheet = false;
  try {
    const context = useBottomSheet();
    if (context) isInsideBottomSheet = true;
  } catch {
    isInsideBottomSheet = false;
  }
  if (isInsideBottomSheet) {
    return <BottomSheetInput {...props} />;
  }
  return <Input ref={ref} {...props} />;
});

SmartInput.displayName = 'SmartInput';
