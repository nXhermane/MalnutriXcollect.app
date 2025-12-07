import { QRIndicator } from '@/components/custom';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { Flashlight, FlashlightOff, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import * as Hapatic from 'expo-haptics';
import { ImportPatientModal } from '@/components/dashboard/ImportPatientModal';

const MALNUTRIX_QRCODE_REGEX = /^malnutrix::data::.*/;
const MALNUTRIX_QRCODE_PREFIX_REGEX = /^malnutrix::data::/;

export default function ImportPatients() {
  const [isLit, setLit] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<string>();
  const [showImportPatientModal, setShowImportPatientModal] = useState<boolean>(false);
  const onFlashToggle = useCallback(() => {
    Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
    setLit((isLit) => !isLit);
  }, []);

  const onCancel = useCallback(() => {
    Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  const onQrCodeScanned = useCallback(({ data }: { data: string }) => {
    if (MALNUTRIX_QRCODE_REGEX.test(data)) {
      const uri = data.replace(MALNUTRIX_QRCODE_PREFIX_REGEX, '');
      setQrCodeData(uri);
      setTimeout(() => {
        setShowImportPatientModal(true);
        Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
      }, 500);
    } else {
      Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
    }
  }, []);

  return (
    <>
      <View className="flex-1">
        <CameraView
          style={{
            flex: 1,
          }}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          enableTorch={isLit}
          onBarcodeScanned={!showImportPatientModal ? onQrCodeScanned : undefined}>
          <VStack className="absolute h-full w-full justify-center items-center">
            {/* TODO: use blue view after the build development */}
            <VStack className="absolute  top-18 p-4 rounded-xl bg-gray-500/10">
              <Text className="font-h4 text-sm text-white">
                Scanner le code qr du nutritioniste
              </Text>
            </VStack>
            <Box className="absolute">
              <QRIndicator />
            </Box>
            <HStack className="absolute bottom-18 justify-between px-10 w-full">
              <Pressable className=" bg-gray-500/50 p-4 rounded-full" onPress={onFlashToggle}>
                <Icon as={isLit ? Flashlight : FlashlightOff} className="text-white" size="lg" />
              </Pressable>
              <Pressable className="  bg-gray-500/50 p-4 rounded-full" onPress={onCancel}>
                <Icon as={X} className="text-white" size="lg" />
              </Pressable>
            </HStack>
          </VStack>
        </CameraView>
      </View>
      {showImportPatientModal && (
        <ImportPatientModal
          isVisible={showImportPatientModal}
          data={qrCodeData}
          onClose={() => {
            setShowImportPatientModal(false);
            setQrCodeData(undefined);
          }}
        />
      )}
    </>
  );
}
