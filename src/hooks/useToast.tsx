import React, { JSXElementConstructor, ReactElement, useCallback } from 'react';
import {
  ToastComponentProps,
  ToastRootAnimation,
  ToastVariant,
  useToast as useHeroToast,
} from 'heroui-native';
import { Icon } from '../components/shared/icons';
import { logger } from '@/lib/utils/logger';
type ToastType = 'Success' | 'Error' | 'Info' | 'Warning';

export interface ToastContextType {
  show: (
    type: ToastType,
    title: string,
    desc?: string,
    placement?: 'top' | 'bottom',
    id?: string,
    data?: {
      isSwipeable?: boolean;
      actionLabel?: string;
      onActionPress?: () => void;
      onHide?: () => void;
      onShow?: () => void;
      animation?: ToastRootAnimation;
      component?: (
        props: ToastComponentProps,
      ) => ReactElement<unknown, string | JSXElementConstructor<unknown>>;
      icon?: React.ReactNode;
    },
  ) => void;
}

const mapToastTypeToToastVariant = (type: ToastType): ToastVariant => {
  switch (type) {
    case 'Success':
      return 'success';
    case 'Error':
      return 'danger';
    case 'Info':
      return 'default';
    case 'Warning':
      return 'warning';
    default:
      return 'default';
  }
};

const mapToastTypeToIcon = (type: ToastType): React.ReactNode => {
  switch (type) {
    case 'Success':
      return <Icon name="Check" className="text-success mt-0.5" size={18} />;
    case 'Error':
      return <Icon name="X" className="text-danger mt-0.5" size={18} />;
    case 'Info':
      return <Icon name="Info" className="text-blue-600 mt-0.5" size={18} />;
    case 'Warning':
      return <Icon name="CircleAlert" className="text-warning mt-0.5" size={18} />;
    default:
      return null;
  }
};
export function useToast() {
  const { toast, isToastVisible } = useHeroToast();

  const show = useCallback(
    (
      type: ToastType,
      title: string,
      desc?: string,
      placement: 'top' | 'bottom' = 'top',
      id?: string,
      data?: {
        duration?: number;
        isSwipeable?: boolean;
        actionLabel?: string;
        onActionPress?: () => void;
        onHide?: () => void;
        onShow?: () => void;
        animation?: ToastRootAnimation;
        component?: (
          props: ToastComponentProps,
        ) => ReactElement<unknown, string | JSXElementConstructor<unknown>>;
        icon?: React.ReactNode;
      },
    ) => {
      const newId = id || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      logger.debug('ToastProvider', {
        calling: 'showToat',
        id: newId,
        title,
        desc,
        placement,
        type,
      });
      if (!isToastVisible) {
        toast.show({
          id: newId,
          label: title,
          description: desc,
          placement: placement,
          duration: data?.duration || 5000,
          variant: mapToastTypeToToastVariant(type),
          icon: data && data.icon ? data.icon : mapToastTypeToIcon(type),
          isSwipeable: data && data.isSwipeable,
          actionLabel: data ? data.actionLabel : 'Fermer',
          onActionPress: data ? data.onActionPress : ({ hide }) => hide(),
          animation: data && data.animation,
          onHide: data && data.onHide,
          onShow: data && data.onShow,
          component: data && data.component,
        });
      }
    },
    [toast, isToastVisible],
  );
  return { show };
}
