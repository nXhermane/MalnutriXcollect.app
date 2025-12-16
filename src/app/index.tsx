import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { Header } from '@/components/dashboard/Header';
import { PatientList } from '@/components/dashboard/PatientList';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useWifiCheck } from '@/hooks';
import { modeles$ } from '@/store';
import { useValue } from '@legendapp/state/react';
import * as Hapatic from 'expo-haptics';
import { router } from 'expo-router';
import { Plus, RefreshCcw } from 'lucide-react-native';
import React, { useState } from 'react';
import { useCameraPermission } from 'react-native-vision-camera';

export default function Index() {
  const [showSearchBar, setShowSeachBar] = useState<boolean>(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const nonExportedPatientsCount = useValue(() => modeles$.non_exported_patients().length);
  const [hideFabs, setHidsFabs] = useState<boolean>(false);
  const { checkAndEnableWifi } = useWifiCheck();

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
          <HStack className="absolute bottom-0 w-full gap-4   px-4 py-4">
            <Button
              className="h-v-12 flex-1 rounded-xl bg-emerald-600 shadow-lg  shadow-emerald-600/20 hover:bg-emerald-700 dark:shadow-emerald-500/10"
              onPress={() => {
                router.navigate('/patient_form');
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}>
              <ButtonIcon as={Plus} size="xl" className="text-white" />
              <ButtonText className="font-h4 text-lg font-medium text-white">Ajouter</ButtonText>
            </Button>
            <Button
              className="relative h-v-12 rounded-xl border-2 border-emerald-600  px-6 hover:bg-emerald-50  dark:border-emerald-500 dark:hover:bg-emerald-950/30"
              variant="outline"
              onPress={async () => {
                if (!hasPermission) {
                  requestPermission();
                  return;
                } else {
                  if (await checkAndEnableWifi()) {
                    router.navigate('/sync');
                    Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
                  } else {
                    Hapatic.notificationAsync(Hapatic.NotificationFeedbackType.Error);
                  }
                }
              }}>
              {nonExportedPatientsCount > 0 && (
                <Badge className="absolute -right-1 -top-1  size-5 items-center justify-center rounded-full bg-orange-500">
                  <BadgeText className="text-2xs text-white">{nonExportedPatientsCount}</BadgeText>
                </Badge>
              )}
              <ButtonIcon as={RefreshCcw} className="text-emerald-600 dark:text-emerald-400" />
            </Button>
          </HStack>
        )}
      </VStack>
    </React.Fragment>
  );
}
