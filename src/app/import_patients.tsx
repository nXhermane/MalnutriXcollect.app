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
import { useValue } from '@legendapp/state/react';
import { isDark$ } from '@/store';

export default function ImportPatients() {
  const [isLit, setLit] = useState<boolean>(false);
  const isDark = useValue(isDark$);
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
      <VStack className="pt-safe flex-1">
        <Camera
          style={{
            flex: 1,
          }}
          device={device}
          isActive={!showImportPatientModal}
          codeScanner={codeScanner}
          format={format}
          torch={isLit ? 'on' : 'off'}
        />
        <VStack className="pt-safe absolute  size-full flex-1">
          <VStack className=" h-18 w-full   items-center justify-center">
            <HStack className="w-full items-center gap-4 px-4 ">
              <Pressable onPress={onCancel} className=" overflow-hidden  rounded-full">
                <BlurView
                  intensity={100}
                  experimentalBlurMethod="dimezisBlurView"
                  tint={isDark ? 'dark' : 'light'}
                  className="size-12 flex-1 items-center justify-center">
                  <Icon as={X} className="text-white" />
                </BlurView>
              </Pressable>
              <HStack className="h-12 flex-1 overflow-hidden rounded-3xl">
                <BlurView
                  intensity={100}
                  experimentalBlurMethod="dimezisBlurView"
                  tint={isDark ? 'dark' : 'light'}
                  className="h-full flex-1 items-center  justify-center">
                  <Text className="text-center font-h4 text-white ">
                    Importer des patients
                  </Text>
                </BlurView>
              </HStack>
            </HStack>
          </VStack>
          <VStack className="flex-1 items-center justify-center">
            <VStack className="absolute  top-14 w-full  overflow-hidden ">
              <BlurView
                className="w-full flex-1 items-center justify-center p-4"
                intensity={100}
                tint={isDark ? 'dark' : 'light'}
                experimentalBlurMethod="dimezisBlurView">
                <Text className="font-h4 text-sm text-white">Scanner un Qr Code MalnutriX</Text>
              </BlurView>
            </VStack>

            <Box className="absolute">
              <QRIndicator progress={progress} />
            </Box>
            <HStack className="absolute bottom-10 w-full justify-center px-10">
              <Pressable className="  overflow-hidden rounded-full" onPress={onFlashToggle}>
                <BlurView
                  intensity={100}
                  className="p-4"
                  tint={isDark ? 'dark' : 'light'}
                  experimentalBlurMethod="dimezisBlurView">
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
