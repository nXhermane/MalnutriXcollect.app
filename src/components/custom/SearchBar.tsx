import { Box } from '../ui/box';
import { Icon } from '../ui/icon';
import {
  IInputFieldProps,
  IInputProps,
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '../ui/input';
import { Search, XCircle } from 'lucide-react-native';
import React from 'react';
export interface SearchBarProps extends IInputProps {
  fieldProps?: IInputFieldProps;
}
export const SearchBar: React.FC<SearchBarProps> = ({ fieldProps, className, ...props }) => {
  return (
    <Box>
      <Input
        className={`h-v-10 rounded-xl border-[0.5px] border-primary-border/10 bg-background-100 data-[focus=true]:border-primary-c ${className}`}
        {...props}>
        <InputSlot className={'pl-3'}>
          <InputIcon as={() => <Icon as={Search} className={'size-5 text-typography-600'} />} />
        </InputSlot>
        <InputField
          className={'font-body text-sm font-normal text-typography-800'}
          placeholderClassName={'text-typography-600/60 font-body text-base  font-normal'}
          {...fieldProps}
        />
        {fieldProps?.value?.trim() !== '' && (
          <InputSlot
            className="pr-3"
            onPress={() => {
              fieldProps?.onChangeText && fieldProps.onChangeText('');
            }}>
            <InputIcon as={XCircle} className={'size-5 text-typography-600'} />
          </InputSlot>
        )}
      </Input>
    </Box>
  );
};
