import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast as useGluestackToast,
} from '@/components/ui/toast';
import { InfoIcon, X } from 'lucide-react-native';
import React, { createContext, ReactNode, useCallback, useContext } from 'react';
import { Dimensions } from 'react-native';
import { ToastPlacement } from '@gluestack-ui/core/lib/esm/toast/creator/types';
import { Icon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';

type ToastType = 'Success' | 'Error' | 'Info';
export interface ToastContextType {
  show: (
    type: ToastType,
    title: string,
    desc?: string,
    placement?: ToastPlacement,
    id?: string,
  ) => void;
}
export const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useGluestackToast();
  const [toastId, setToastId] = React.useState('0');

  const show = useCallback(
    (
      type: ToastType,
      title: string,
      desc?: string,
      placement: ToastPlacement = 'bottom',
      id?: string,
    ) => {
      const newId = id || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setToastId(newId);

      console.log(`[ToastContext] Showing ${type} toast with id: ${newId}`);
      if (!toast.isActive(toastId))
        toast.show({
          id: newId,
          placement: placement,
          duration: 5000,
          containerStyle: {
            width: Dimensions.get('screen').width,
            zIndex: 9999,
          },
          render: ({ id }) => {
            console.log(`[ToastContext] Rendering ${type} toast component with id: ${id}`);
            return <CustomToast id={id} type={type} title={title} description={desc} />;
          },
        });
    },
    [toast, toastId],
  );

  return <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>;
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProps {
  type: ToastType;
  id: string;
  title: string;
  description?: string;
}
const CustomToast: React.FC<ToastProps> = ({ id, type, title, description }) => {
  const toast = useGluestackToast();
  const variant: Record<
    ToastType,
    {
      icon: string;
      title: string;
    }
  > = {
    Info: {
      icon: 'bg-blue-700 text-white dark:bg-blue-500',
      title: 'text-blue-700 dark:text-blue-400',
    },
    Error: {
      icon: 'bg-red-700 text-white dark:bg-red-500',
      title: 'text-red-700 dark:text-red-400',
    },
    Success: {
      icon: 'bg-green-700 text-white dark:bg-green-500',
      title: 'text-green-700 dark:text-green-400',
    },
  };
  return (
    <Toast
      nativeID={id}
      style={{
        alignSelf: 'center',
      }}
      className={' w-[95%] overflow-hidden rounded-xl border border-border bg-card p-4'}>
      <Pressable
        onPress={() => {
          toast.close(id);
          if (toast.isActive(id)) {
            toast.closeAll();
          }
        }}
        className={'absolute right-3 top-3'}>
        <Icon as={X} size={'md'} className={'text-foreground'} />
      </Pressable>
      <HStack className="items-center gap-3">
        <Icon
          as={InfoIcon}
          className={`size-6 items-center justify-center rounded-full ${variant[type].icon}`}
        />

        <VStack className="w-[90%]">
          {title && (
            <ToastTitle className={`text-base font-semibold ${variant[type].title}`}>
              {title}
            </ToastTitle>
          )}
          {description && (
            <ToastDescription className={`mt-1 text-sm text-muted-foreground`}>
              {description}
            </ToastDescription>
          )}
        </VStack>
      </HStack>
    </Toast>
  );
};
