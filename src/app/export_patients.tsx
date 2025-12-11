import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useExportPatientViewModel } from '@/hooks';
import { useEffect, useState } from 'react';
import { dataToFrames } from 'qrloop';
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

export default function ExportPatients() {
  const { exportPatient, data, confirmExport, confirmIsLoading, isConfirmed } =
    useExportPatientViewModel();

  const [dataFrames, setDataFrames] = useState<string[]>([]);

  useEffect(() => {
    // TODO: improve perfs
    exportPatient();
  }, [exportPatient]);
  useEffect(() => {
    if (data) {
      setDataFrames(dataToFrames(data, 150, 5));
    }
  }, [data]);
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => router.back(), 1000);
    }
  }, [isConfirmed]);
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
        <HStack className="rounded-xl  border border-border bg-card">
          <Center className="min-h-64 min-w-64 rounded-xl border-2 border-border bg-card p-6 shadow-md ">
            {dataFrames.length !== 0 ? (
              <QrCodeLoop frames={dataFrames} />
            ) : (
              <Spinner size={'large'} className="text-blue-500" />
            )}
          </Center>
        </HStack>
      </VStack>
      {/* <VStack className="h-60  items-center justify-center px-4">
        <VStack className="rounded-xl border-[0.5px] border-blue-200 bg-blue-50 p-4 dark:border-transparent dark:bg-background-50">
          <HStack className="mb-2 items-center gap-3">
            <Icon as={Info} />
            <Text className="  text-center font-h4 text-lg font-medium text-blue-900 dark:text-typography-800">
              {"Étapes d'export"}
            </Text>
          </HStack>
          <Text className="mb-1 font-body text-sm font-normal text-blue-800 dark:text-gray-400">
            {'1. Le nutritionniste scanne le Qr Code'}
          </Text>
          <Text className="mb-1 font-body text-sm font-normal text-blue-800 dark:text-gray-400">
            {'2. Vérifiez que toutes les données sont transférés'}
          </Text>
          <Text className="mb-1 font-body text-sm font-normal text-blue-800 dark:text-gray-400">
            {`3. Cliquez sur "Confirmer l'export" ci-dessous`}
          </Text>
        </VStack>
      </VStack> */}
      <VStack className=" bottom-0  w-full p-4">
        <Button
          className={`h-v-12  w-full rounded-xl ${isConfirmed ? 'bg-green-500 ' : 'bg-blue-500'} `}
          onPress={() => {
            confirmExport();
            Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
          }}
          disabled={dataFrames.length === 0 || confirmIsLoading}>
          {confirmIsLoading ? (
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
