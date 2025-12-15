import { QRIndicator } from '@/components/custom';
import { SyncModal } from '@/components/dashboard/SyncModal';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useToast } from '@/providers/Toast';
import { isDark$ } from '@/store';
import {
  getMalnutriXPayload,
  getMalnutriXPayloadContent,
  isMalnutriXUri,
} from '@/utils/malnutrix_format';
import { useValue } from '@legendapp/state/react';
import { BlurView } from 'expo-blur';
import * as Hapatic from 'expo-haptics';
import { router } from 'expo-router';
import { Flashlight, FlashlightOff, X } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';

export default function SyncScreen() {
  const toast = useToast();
  const [isLit, setLit] = useState<boolean>(false);
  const isDark = useValue(isDark$);
  const [qrCodeData, setQrCodeData] = useState<{
    host: string;
    port: number;
    ssid: string;
    password: string;
  } | null>(null);
  const isScanning = useRef(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
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
      try {
        for (const code of codes) {
          if (isScanning.current) return;
          if (!code.value || code.type !== 'qr') return;

          if (isMalnutriXUri(code.value)) {
            const payload = getMalnutriXPayload(code.value);
            if (payload === null) {
              Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
              return;
            }
            const data = getMalnutriXPayloadContent(payload);
            setQrCodeData(data);
            setTimeout(() => {
              setShowSyncModal(true);
              isScanning.current = true;
              Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
            }, 500);
          } else {
            Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
          }
        }
      } catch (e) {
        console.warn(e);
        toast.show(
          'Error',
          "Erreur lors du traitement de l'QR code",
          undefined,
          'top',
          'scan_error',
        );
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
          isActive={!showSyncModal}
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
                  <Icon as={X} className="text-muted-foreground" />
                </BlurView>
              </Pressable>
              <HStack className="h-12 flex-1 overflow-hidden rounded-3xl">
                <BlurView
                  intensity={100}
                  experimentalBlurMethod="dimezisBlurView"
                  tint={isDark ? 'dark' : 'light'}
                  className="h-full flex-1 items-center  justify-center">
                  <Text className="text-center font-h4 text-foreground ">Synchronisation</Text>
                </BlurView>
              </HStack>
            </HStack>
          </VStack>
          <VStack className="flex-1 items-center justify-center px-4">
            <VStack className="absolute top-14 w-full  overflow-hidden rounded-xl ">
              <BlurView
                className="w-full flex-1 items-center justify-center p-4"
                intensity={100}
                tint={isDark ? 'dark' : 'light'}
                experimentalBlurMethod="dimezisBlurView">
                <Text className="font-h4 text-sm text-foreground">
                  Scanner le QR du nutritionniste
                </Text>
              </BlurView>
            </VStack>

            <Box className="absolute">
              <QRIndicator />
            </Box>
            <HStack className="absolute bottom-10 w-full justify-center px-10">
              <Pressable className="  overflow-hidden rounded-full" onPress={onFlashToggle}>
                <BlurView
                  intensity={100}
                  className="p-4"
                  tint={isDark ? 'dark' : 'light'}
                  experimentalBlurMethod="dimezisBlurView">
                  <Icon
                    as={isLit ? Flashlight : FlashlightOff}
                    className="text-muted-foreground"
                    size="lg"
                  />
                </BlurView>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
      {showSyncModal && (
        <SyncModal
          isVisible={showSyncModal}
          data={qrCodeData!}
          onClose={() => {
            setShowSyncModal(false);
            isScanning.current = false;
            setQrCodeData(null);
          }}
        />
      )}
    </>
  );
}
