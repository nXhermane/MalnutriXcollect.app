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
import { useCallback, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import * as Hapatic from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { ImportPatientModal } from '@/components/dashboard/ImportPatientModal';
import {
  areFramesComplete,
  framesToData,
  parseFramesReducer,
  progressOfFrames,
  State,
} from 'qrloop';
import { isMalnutriXCollectUri } from '@/utils/malnutrix_formt';

export default function ImportPatients() {
  const [isLit, setLit] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<string | undefined>('hello');
  const frames = useRef<State>(null);
  const [progress, setProgress] = useState(0);
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
    try {
      frames.current = parseFramesReducer(frames.current, data);
      if (areFramesComplete(frames.current)) {
        const uri = framesToData(frames.current).toString();
        setProgress(progressOfFrames(frames.current));
        // TODO: Change to isMalnutriXUri
        if (isMalnutriXCollectUri(uri)) {
          setQrCodeData(uri);
          setTimeout(() => {
            setShowImportPatientModal(true);
            Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
          }, 500);
        } else {
          Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
        }
      } else {
        setProgress(progressOfFrames(frames.current));
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
        }}>
        <CameraView
          style={{
            flex: 1,
            minHeight: Dimensions.get('screen').height,
            minWidth: Dimensions.get('screen').width,
          }}
          facing={'back'}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          enableTorch={isLit}
          onBarcodeScanned={!showImportPatientModal ? onQrCodeScanned : undefined}>
          <View
            style={{
              flex: 1,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
            }}>
            <VStack className="top-0 absolute h-18 w-full   justify-center items-center">
              <HStack className="px-4 items-center gap-4 w-full ">
                <Pressable onPress={onCancel} className=" overflow-hidden  rounded-full">
                  <BlurView
                    intensity={100}
                    experimentalBlurMethod="dimezisBlurView"
                    className="items-center justify-center h-12 w-12 flex-1">
                    <Icon as={X} className="" />
                  </BlurView>
                </Pressable>
                <HStack className="flex-1 h-12 overflow-hidden rounded-3xl">
                  <BlurView
                    intensity={100}
                    experimentalBlurMethod="dimezisBlurView"
                    className="flex-1 h-full justify-center  items-center">
                    <Text className="font-h4 text-typography-950 text-center ">
                      Importer des patients
                    </Text>
                  </BlurView>
                </HStack>
              </HStack>
            </VStack>
            <VStack className="absolute  top-24 w-full  overflow-hidden ">
              <BlurView
                className="flex-1 p-4 w-full justify-center items-center"
                intensity={50}
                experimentalBlurMethod="dimezisBlurView">
                <Text className="font-h4 text-sm text-white">Scanner un Qr Code MalnutriX</Text>
              </BlurView>
            </VStack>

            <Box className="absolute">
              <QRIndicator progress={progress} />
            </Box>
            <HStack className="absolute bottom-18 justify-center px-10 w-full">
              <Pressable className="  rounded-full overflow-hidden" onPress={onFlashToggle}>
                <BlurView intensity={100} className="p-4">
                  <Icon as={isLit ? Flashlight : FlashlightOff} className="text-white" size="lg" />
                </BlurView>
              </Pressable>
              {/* <Pressable className="  rounded-full overflow-hidden" onPress={onCancel}>
                <BlurView intensity={100} className="p-4">
                  <Icon as={X} className="text-white" size="lg" />
                </BlurView>
              </Pressable> */}
            </HStack>
          </View>
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
