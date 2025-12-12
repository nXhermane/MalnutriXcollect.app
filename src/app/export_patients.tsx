import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMarkPatientAsExportedViewModel } from '@/hooks';
import { useEffect, useState } from 'react';
import { QrCodeLoop } from '@/components/dashboard/QRCodeLoop';
import { Spinner } from '@/components/ui/spinner';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Check, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Center } from '@/components/ui/center';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import * as Hapatic from 'expo-haptics';
import { useValue } from '@legendapp/state/react';
import { export_patient$ } from '@/store/export_patient';
import { InteractionManager } from 'react-native';

export default function ExportPatients() {
  const export_patient_info = useValue(() => export_patient$.get());
  const { isLoading, markPatientAsExported } = useMarkPatientAsExportedViewModel();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [shouldRenderQr, setShouldRenderQr] = useState(false);
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      setShouldRenderQr(true);
    });
    return () => interactionPromise.cancel();
  }, []);
  return (
    <VStack className="pt-safe flex-1 bg-bg">
      <VStack className=" h-18 w-full  items-center justify-center">
        <HStack className="w-full items-center gap-4 px-4 ">
          <Pressable
            onPress={() => {
              router.back();
              Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
            }}
            className="elevation-sm size-12 items-center justify-center rounded-full bg-card">
            <Icon as={X} className="text-muted-foreground" />
          </Pressable>
          <HStack className="elevation-sm h-12 flex-1 items-center justify-center rounded-3xl bg-card">
            <Text className="text-center font-h4 text-foreground ">Exporter vos patients</Text>
          </HStack>
        </HStack>
      </VStack>
      <VStack className="w-full flex-1 items-center justify-center px-4">
        {shouldRenderQr ? (
          <QrCodeContent
            frames={export_patient_info.data_frames || []}
            isRunning={export_patient_info.isRunning}
          />
        ) : (
          <Center className="min-h-64 min-w-64">
            <Spinner size={'large'} className="text-blue-500" />
          </Center>
        )}
      </VStack>
      <VStack className=" bottom-0  w-full p-4">
        <Button
          className={`h-v-12  w-full rounded-xl ${isConfirmed ? 'bg-green-500 ' : 'bg-blue-500'} `}
          onPress={() => {
            markPatientAsExported(export_patient_info.compiled_patient_ids);
            setIsConfirmed(true);
            Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
          }}
          isDisabled={!shouldRenderQr || export_patient_info.isRunning || isLoading}>
          {isLoading ? (
            <ButtonSpinner className="text-white" />
          ) : (
            <ButtonText className="font-h4 text-base text-white">{"Confirmer l'export"}</ButtonText>
          )}
          {isConfirmed && <ButtonIcon as={Check} className="text-white" />}
        </Button>
        <Text className="pt-2 text-center font-light text-xs text-gray-700 dark:text-gray-400">
          Les patients seront marqués comme exportés après confirmation
        </Text>
      </VStack>
    </VStack>
  );
}

const QrCodeContent = ({ frames, isRunning }: { frames: string[]; isRunning: boolean }) => {
  return (
    <>
      <HStack className="rounded-xl  border border-border bg-card">
        <Center className="min-h-64 min-w-64 rounded-xl border-2 border-border bg-card p-6 shadow-md ">
          {!isRunning ? (
            <QrCodeLoop frames={frames || []} />
          ) : (
            <Spinner size={'large'} className="text-blue-500" />
          )}
        </Center>
      </HStack>
    </>
  );
};
