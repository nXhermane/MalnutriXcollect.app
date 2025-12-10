import { BottomSheetModal } from '../custom';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';

export function AddPatientModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose?: () => void;
}) {
  return (
    <BottomSheetModal
      isVisible={isVisible}
      onClose={onClose}
      stackBehavior="switch"
      snapPoints={['80%']}
      enableContentPanningGesture>
      <VStack className="h-full flex-1">
        <HStack className="items-center justify-center border-b border-primary-border/5 px-4 py-3">
          <Text className="text-center font-h4 text-lg font-medium text-typography-950 dark:text-typography-0">
            Nouveau patient
          </Text>
        </HStack>
        {/**
         * TODO!
         */}
      </VStack>
    </BottomSheetModal>
  );
}
