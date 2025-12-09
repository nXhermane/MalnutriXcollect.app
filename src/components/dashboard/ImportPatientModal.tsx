import { BottomSheetModal } from '../custom';
import { VStack } from '../ui/vstack';

import { useImportPatientViewModel } from '@/hooks/useImportPatientViewModel';
import { Center } from '../ui/center';
import { Spinner } from '../ui/spinner';
import { useToast } from '@/providers/Toast';
import { useEffect } from 'react';
import { Icon } from '../ui/icon';
import { AlertTriangle, Check } from 'lucide-react-native';

export function ImportPatientModal({
  isVisible,
  onClose,
  data,
}: {
  isVisible: boolean;
  onClose?: () => void;
  data?: string;
}) {
  const toast = useToast();
  const { error, importPatient, isLoading } = useImportPatientViewModel();
  useEffect(() => {
    if (error) {
      toast.show('Error', "Une erreur est survenue lors de l'importation.", error, 'top');
      onClose && onClose();
    }
  }, [error, toast, onClose]);
  useEffect(() => {
    if (data) importPatient(data);
  }, [data, importPatient]);
  return (
    <BottomSheetModal
      isVisible={isVisible}
      onClose={onClose}
      stackBehavior="switch"
      snapPoints={['20%']}
      enableContentPanningGesture>
      <VStack className="h-full flex-1">
        <Center className="flex-1 ">
          {isLoading ? (
            <Spinner size={'large'} className="text-blue-500 h-18 w-18" />
          ) : (
            <Icon
              as={error ? AlertTriangle : Check}
              className={`h-18 w-18 ${error ? 'text-warning-500' : 'text-green-500'}`}
            />
          )}
        </Center>
      </VStack>
    </BottomSheetModal>
  );
}
