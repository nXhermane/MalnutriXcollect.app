import { QRIndicator } from '@/components/custom';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
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
import { isMalnutriXUri } from '@/utils/malnutrix_formt';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';

export default function ImportPatients() {
  const [isLit, setLit] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<string | undefined>('hello');
  const frames = useRef<State>(null);
  const [progress, setProgress] = useState(0);
  const [showImportPatientModal, setShowImportPatientModal] = useState<boolean>(false);
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {
      videoResolution: 'max',
      photoResolution: 'max',
    },
  ]);
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        if (!code.value) return;
        try {
          frames.current = parseFramesReducer(frames.current, code.value);
          if (areFramesComplete(frames.current)) {
            const uri = framesToData(frames.current).toString();
            setProgress(progressOfFrames(frames.current));
            if (isMalnutriXUri(uri)) {
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
      }
    },
  });
  const onFlashToggle = useCallback(() => {
    Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
    setLit((isLit) => !isLit);
  }, []);

  const onCancel = useCallback(() => {
    Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  if (!device) {
    alert('Ce smarphone ne peux pas importez de patient.');
    return null;
  }

  return (
    <>
      <VStack className="flex-1 pt-safe">
        <Camera
          style={{
            flex: 1,
            minHeight: Dimensions.get('screen').height,
            minWidth: Dimensions.get('screen').width,
          }}
          device={device}
          isActive={!showImportPatientModal}
          codeScanner={codeScanner}
          format={format}
          torch={isLit ? 'on' : 'off'}
        />
        <VStack className="flex-1 absolute  h-full w-full pt-safe">
          <VStack className=" h-18 w-full   justify-center items-center">
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
          <VStack className="flex-1 items-center justify-center">
            <VStack className="absolute  top-14 w-full  overflow-hidden ">
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
            <HStack className="absolute bottom-10 justify-center px-10 w-full">
              <Pressable className="  rounded-full overflow-hidden" onPress={onFlashToggle}>
                <BlurView intensity={100} className="p-4">
                  <Icon as={isLit ? Flashlight : FlashlightOff} className="text-white" size="lg" />
                </BlurView>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </VStack>

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
