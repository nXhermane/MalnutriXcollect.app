import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { Header } from '@/components/dashboard/Header';
import { PatientList } from '@/components/dashboard/PatientList';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Plus, QrCode, ScanQrCode } from 'lucide-react-native';
import React, { useState } from 'react';

export default function Index() {
  const [showSearchBar, setShowSeachBar] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <React.Fragment>
      <VStack className="flex-1 bg-background-0">
        <Header
          searchBarIsVisible={showSearchBar}
          toggleSearchBar={() => setShowSeachBar((prev) => !prev)}
        />
        <ControlPanel showSearchBar={showSearchBar} />
        <PatientList />
        <HStack className="absolute w-full bottom-0 justify-center gap-4">
          <Fab
            className="fixed right-0 h-12 w-12 bg-primary-c_light"
            onPress={() => {
              if (permission?.granted) {
                router.navigate('/import_patients');
              } else {
                requestPermission();
              }
            }}>
            <FabIcon as={ScanQrCode} className="text-white" />
          </Fab>
          <Fab
            className="fixed right-0 h-12 bg-primary-c_light"
            onPress={() => router.navigate('/add_patient')}>
            <FabIcon as={Plus} className="text-white" />
            <FabLabel className="font-semibold font-h3 text-white text-base">Ajouter</FabLabel>
          </Fab>
          <Fab
            className="fixed right-0 h-12 w-12 bg-primary-c_light"
            onPress={() => {
              router.navigate('/export_patients');
            }}>
            <FabIcon as={QrCode} className="text-white" />
          </Fab>
        </HStack>
      </VStack>
    </React.Fragment>
  );
}
