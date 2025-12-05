import { BottomSheetModal } from '../custom';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';

export function ImportPatientModal({
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
        <HStack className="items-center justify-center border-b-[1px] border-primary-border/5 px-4 py-3">
          <Text className="font-h4 text-lg font-medium text-typography-primary text-center">
            Importer les patients
          </Text>
        </HStack>
        {/**
         * TODO!
         */}
      </VStack>
    </BottomSheetModal>
  );
}
