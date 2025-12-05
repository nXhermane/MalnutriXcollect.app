import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { Header } from '@/components/dashboard/Header';
import { PatientList } from '@/components/dashboard/PatientList';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Camera, Plus, QrCode, ScanQrCode } from 'lucide-react-native';
import { useState } from 'react';

export default function Index() {
  const [showSearchBar, setShowSeachBar] = useState<boolean>(false);
  return (
    <VStack className="flex-1 bg-background-50">
      <Header
        searchBarIsVisible={showSearchBar}
        toggleSearchBar={() => setShowSeachBar((prev) => !prev)}
      />
      <ControlPanel showSearchBar={showSearchBar} />
      <PatientList />
      <HStack className="absolute bottom-0  w-full justify-center gap-4">
        <Fab
          className="relative h-12 w-12 bg-primary-c_light"
          onPress={() => alert('Show exportation qrcode')}>
          <FabIcon as={QrCode} className="text-white" />
        </Fab>
        <Fab
          className="relative h-12 bg-primary-c_light"
          onPress={() => alert('Show add patient bottom sheet or screen')}>
          <FabIcon as={Plus} className="text-white" />
          <FabLabel className="font-semibold font-h3 text-white text-base">Ajouter</FabLabel>
        </Fab>
      </HStack>
    </VStack>
  );
}
