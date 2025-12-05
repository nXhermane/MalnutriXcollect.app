import { AddPatientModal } from '@/components/dashboard/AddPatientModal';
import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { ExportPatientModal } from '@/components/dashboard/ExportPatientModal';
import { Header } from '@/components/dashboard/Header';
import { PatientList } from '@/components/dashboard/PatientList';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Plus, QrCode } from 'lucide-react-native';
import React, { useState } from 'react';

export default function Index() {
  const [showSearchBar, setShowSeachBar] = useState<boolean>(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState<boolean>(false);
  const [showExportPatientModal, setShowExportPatientModal] = useState<boolean>(false);

  return (
    <React.Fragment>
      <VStack className="flex-1 bg-background-0">
        <Header
          searchBarIsVisible={showSearchBar}
          toggleSearchBar={() => setShowSeachBar((prev) => !prev)}
        />
        <ControlPanel showSearchBar={showSearchBar} />
        <PatientList />
        <HStack className="absolute bottom-0  w-full justify-center gap-4">
          <Fab
            className="relative h-12 w-12 bg-primary-c_light"
            onPress={() => setShowExportPatientModal(true)}>
            <FabIcon as={QrCode} className="text-white" />
          </Fab>
          <Fab
            className="relative h-12 bg-primary-c_light"
            onPress={() => setShowAddPatientModal(true)}>
            <FabIcon as={Plus} className="text-white" />
            <FabLabel className="font-semibold font-h3 text-white text-base">Ajouter</FabLabel>
          </Fab>
        </HStack>
      </VStack>
      {showAddPatientModal && (
        <AddPatientModal
          isVisible={showAddPatientModal}
          onClose={() => setShowAddPatientModal(false)}
        />
      )}
      {showExportPatientModal && (
        <ExportPatientModal
          isVisible={showExportPatientModal}
          onClose={() => setShowExportPatientModal(false)}
        />
      )}
    </React.Fragment>
  );
}
