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
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Center } from '@/components/ui/center';
import { Button, ButtonText } from '@/components/ui/button';

export default function ExportPatients() {
  const { exportPatient, data } = useExportPatientViewModel();
  const [dataFrames, setDataFrames] = useState<string[]>([]);

  useEffect(() => {
    exportPatient();
  }, [exportPatient]);
  useEffect(() => {
    if (data) {
      setDataFrames(dataToFrames(data, 50));
    }
  }, [data]);
  return (
    <VStack className="flex-1 bg-background-50 dark:bg-background-0">
      <VStack className=" h-18 w-full   justify-center items-center">
        <HStack className="px-4 items-center gap-4 w-full ">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center bg-background-0 dark:bg-background-50 rounded-full">
            <Icon as={X} className="" />
          </Pressable>
          <HStack className="flex-1 h-12 justify-center bg-background-0 dark:bg-background-50 items-center rounded-3xl">
            <Text className="font-h4 text-typography-950 text-center ">Exporter vos patients</Text>
          </HStack>
        </HStack>
      </VStack>
      <VStack className="w-full h-80 items-center justify-center">
        <Center className="p-4 rounded-3xl bg-background-0 dark:bg-background-50">
          {dataFrames.length !== 0 ? (
            <QrCodeLoop frames={dataFrames} />
          ) : (
            <Spinner size={'large'} />
          )}
        </Center>
      </VStack>
      <VStack className="h-60  px-4 items-center justify-center">
        <VStack className="bg-info-500/10 p-4 rounded-xl border-info-500 border-[0.5px]">
          <Text className="text-info-500 font-h4 text-lg font-medium pb-3 text-center">
            {"Étapes d'export"}
          </Text>
          <Text className="text-info-500 font-body text-sm font-normal pb-2">
            {'1. Le nutritionniste scanne le Qr Code'}
          </Text>
          <Text className="text-info-500 font-body text-sm font-normal pb-2">
            {'2. Vérifiez que toutes les données sont transférés'}
          </Text>
          <Text className="text-info-500 font-body text-sm font-normal pb-2">
            {`3. Cliquez sur "Confirmer l'export" ci-dessous`}
          </Text>
        </VStack>
      </VStack>
      <VStack className="w-full px-4  ">
        <Button className="w-full  rounded-xl h-v-12 bg-green-500">
          <ButtonText className="text-white font-h4 text-base">{"Confirmer l'export"}</ButtonText>
        </Button>
        <Text className="text-center text-xs text-gray-700 pt-2">
          Les patients seront marqués comme exportés après confirmation
        </Text>
      </VStack>
    </VStack>
  );
}
