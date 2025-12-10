import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { Header } from '@/components/dashboard/Header';
import { PatientList } from '@/components/dashboard/PatientList';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { modeles$ } from '@/store';
import { useValue } from '@legendapp/state/react';
import { useCameraPermission } from 'react-native-vision-camera';
import { router } from 'expo-router';
import { Plus, QrCode, ScanQrCode } from 'lucide-react-native';
import React, { useState } from 'react';
import * as Hapatic from 'expo-haptics';

export default function Index() {
  const [showSearchBar, setShowSeachBar] = useState<boolean>(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const unExportedPatientsNums = useValue(() => modeles$.un_exported_patients().length);

  return (
    <React.Fragment>
      <VStack className="flex-1 bg-background-50 dark:bg-background-0">
        <Header
          searchBarIsVisible={showSearchBar}
          toggleSearchBar={() => setShowSeachBar((prev) => !prev)}
        />
        <ControlPanel showSearchBar={showSearchBar} />
        <PatientList />
        <HStack className="absolute bottom-0 w-full  justify-between gap-4 px-4">
          <Fab
            className="fixed right-0 size-12 bg-green-500 hover:bg-green-600 "
            onPress={() => {
              if (!hasPermission) {
                requestPermission();
                return;
              } else {
                router.navigate('/import_patients');
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }
            }}>
            <FabIcon as={ScanQrCode} className="text-white" />
          </Fab>
          <Fab
            className="fixed -top-8 right-0 size-14 bg-green-600 hover:bg-green-700"
            onPress={() => {
              router.navigate('/add_patient');
              Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
            }}>
            <FabIcon as={Plus} className="text-white" />
            <FabLabel className="absolute -bottom-4 font-light text-xs  font-semibold text-gray-700 dark:text-gray-400">
              Ajouter
            </FabLabel>
          </Fab>
          <Fab
            disabled={unExportedPatientsNums === 0}
            className="fixed right-0 size-12 bg-green-500 hover:bg-green-600 "
            onPress={() => {
              router.navigate('/export_patients');
              Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
            }}>
            {unExportedPatientsNums > 0 && (
              <Badge className="absolute -right-1 -top-1  size-5 items-center justify-center rounded-full bg-orange-500">
                <BadgeText className="text-2xs text-white">{unExportedPatientsNums}</BadgeText>
              </Badge>
            )}
            <FabIcon as={QrCode} className="text-white" />
          </Fab>
        </HStack>
      </VStack>
    </React.Fragment>
  );
}
