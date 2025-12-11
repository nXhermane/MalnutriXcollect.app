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
        className={`h-11 rounded-xl border border-border bg-card data-[focus=true]:border-green-400 data-[focus=true]:ring-green-400   ${className}`}
        {...props}>
        <InputSlot className={'pl-3'}>
          <InputIcon as={() => <Icon as={Search} className={'size-5 text-muted-foreground'} />} />
        </InputSlot>
        <InputField
          className={'font-body text-sm font-normal text-foreground'}
          placeholderClassName={'text-muted-foreground font-body text-base  font-normal'}
          {...fieldProps}
        />
        {fieldProps?.value?.trim() !== '' && (
          <InputSlot
            className="pr-3"
            onPress={() => {
              fieldProps?.onChangeText && fieldProps.onChangeText('');
            }}>
            <InputIcon as={XCircle} className={'size-5 text-muted-foreground'} />
          </InputSlot>
        )}
      </Input>
    </Box>
  );
};
