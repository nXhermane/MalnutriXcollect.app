import {
  BottomSheetModalProps as GHBottomSheetModalProps,
  BottomSheetModal as GHBottomSheetModal,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { isDark$ } from '@/store';
import { router } from 'expo-router';
import { BackHandler } from 'react-native';
import colors from 'tailwindcss/colors';
import { BottomSheetDragIndicator } from '@/components/ui/bottomsheet';
import { VStack } from '../ui/vstack';
import { useValue } from '@legendapp/state/react';

interface BottomSheetModalProps
  extends Omit<
    GHBottomSheetModalProps,
    | 'children'
    | 'handleIndicatorStyle'
    | 'ref'
    | 'handleComponent'
    | 'backgroundComponent'
    | 'backdropComponent'
  > {
  isVisible: boolean;
  onClose?: () => void;
  bgClassName?: string;
  children?: React.ReactNode | React.ReactNode[];
}
export function BottomSheetModal({
  isVisible,
  onClose,
  snapPoints,
  bgClassName,
  enableDynamicSizing = false,
  enableContentPanningGesture = false,
  detached = false,
  bottomInset = 0,
  children,
  ...props
}: BottomSheetModalProps) {
  const ref = React.useRef<GHBottomSheetModal>(null);
  const isDark = useValue(isDark$);
  React.useEffect(() => {
    if (isVisible) {
      ref.current?.present();
    } else {
      ref.current?.close();
    }
  }, [isVisible]);
  React.useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        ref.current?.close();
      } else {
        if (router.canGoBack()) {
          router.back();
        }
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isVisible]);

  return (
    <React.Fragment>
      <GHBottomSheetModal
        onDismiss={() => onClose && onClose()}
        ref={ref}
        snapPoints={snapPoints ?? ['50%']}
        handleIndicatorStyle={{
          backgroundColor: isDark ? colors.gray['500'] : colors.gray['300'],
        }}
        handleComponent={(props) => <BottomSheetDragIndicator {...props} className="py-3" />}
        backgroundComponent={(props) => {
          return (
            <VStack
              {...props}
              className={`rounded-3xl bg-background-50 dark:bg-background-0 ${bgClassName}`}
            />
          );
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} opacity={0.5} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
        enableDynamicSizing={enableDynamicSizing}
        enableContentPanningGesture={enableContentPanningGesture}
        detached={detached}
        bottomInset={bottomInset}
        {...props}>
        {children}
      </GHBottomSheetModal>
    </React.Fragment>
  );
}
