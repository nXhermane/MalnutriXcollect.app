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
import React, { useEffect, useState } from 'react';
import * as Hapatic from 'expo-haptics';
import { export_patient$ } from '@/store/export_patient';
import { compileUnExportedPatient, exportCompiledPatient } from '@/utils/export_patient_utils';
import { dataToFrames } from 'qrloop';
import { observe } from '@legendapp/state';

observe(() => {
  const unExportedPatients = modeles$.non_exported_patients.get();
  if (unExportedPatients.length > 0) {
    const process = async () => {
      export_patient$.isRunning.set(true);
      const patients = Object.values(modeles$.patients.get());
      const patients_measures = modeles$.patient_measures.get();
      const data = compileUnExportedPatient(Object.values(patients), patients_measures);
      const formated_data = exportCompiledPatient(JSON.stringify(data.data));
      const frames = dataToFrames(formated_data, 50, 5);
      export_patient$.compiled_patient_ids.set(data.exported_patient_ids);
      export_patient$.data_frames.set(frames);
      export_patient$.isRunning.set(false);
      console.log('changed');
    };
    process()
      .then(() => {})
      .catch((e) => {
        console.warn(`Error in data compilation => `, e);
      });
  } else {
    export_patient$.set({
      compiled_patient_ids: [],
      isRunning: false,
      data_frames: null,
    });
  }
});

export default function Index() {
  const [showSearchBar, setShowSeachBar] = useState<boolean>(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const nonExportedPatientsCount = useValue(() => modeles$.non_exported_patients().length);
  const [hideFabs, setHidsFabs] = useState<boolean>(false);
  useEffect(() => {
    router.prefetch('/export_patients');
  }, []);
  return (
    <React.Fragment>
      <VStack className="flex-1 bg-bg">
        <Header
          searchBarIsVisible={showSearchBar}
          toggleSearchBar={() => setShowSeachBar((prev) => !prev)}
        />
        <ControlPanel showSearchBar={showSearchBar} />
        <PatientList
          onScrollEnd={() => setHidsFabs(false)}
          onScrollStart={() => setHidsFabs(true)}
        />
        {!hideFabs && (
          <HStack className="absolute bottom-0 w-full  justify-between gap-4 px-4">
            <Fab
              className="elevation-md fixed right-0 size-12 bg-green-500 hover:bg-green-600 "
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
              className="elevation-md  fixed -top-8 right-0 size-14 bg-green-600 hover:bg-green-700"
              onPress={() => {
                router.navigate('/patient_form');
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}>
              <FabIcon as={Plus} className="text-white" />
              <FabLabel className="absolute -bottom-4 font-light text-xs  font-semibold text-gray-700 dark:text-gray-400">
                Ajouter
              </FabLabel>
            </Fab>
            <Fab
              disabled={nonExportedPatientsCount === 0}
              className="elevation-md  fixed  right-0 size-12 bg-green-500 hover:bg-green-600 "
              onPress={() => {
                router.navigate('/export_patients');
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}>
              {nonExportedPatientsCount > 0 && (
                <Badge className="absolute -right-1 -top-1  size-5 items-center justify-center rounded-full bg-orange-500">
                  <BadgeText className="text-2xs text-white">{nonExportedPatientsCount}</BadgeText>
                </Badge>
              )}
              <FabIcon as={QrCode} className="text-white" />
            </Fab>
          </HStack>
        )}
      </VStack>
    </React.Fragment>
  );
}
