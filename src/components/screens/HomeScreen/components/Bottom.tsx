import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { vibrate } from '@/lib/utils/haptics';
import { patients$ } from '@/store/patients/patients.store';
// import { visits$ } from '@/store/visits/visits.store';
import { useValue } from '@legendapp/state/react';
import { useRouter } from 'expo-router';
import { Button, cn, Surface } from 'heroui-native';
import { View } from 'react-native';

export function HomeBottom() {
  const router = useRouter();
  const patientCount = useValue(() => Object.keys(patients$.get()).length);

  // const nonExportedCount = useValue(() => {
  //   const allVisits = visits$.get();
  //   return Object.values(allVisits).filter((visits) => visits.some((v) => !v.isExported)).length;
  // });

  return (
    <Surface variant="transparent" className="absolute bottom-0 w-full overflow-hidden z-50 p-0">
      <BlurView />
      <View className="px-4 py-4 flex-row gap-4">
        {patientCount > 0 && (
          <Button
            className="flex-1 h-12 rounded-2xl shadow-lg"
            onPress={() => {
              vibrate('soft');
              router.push('/patient-form');
            }}>
            <Button.Label className="text-white">Ajouter un patient</Button.Label>
          </Button>
        )}
        <View className={cn(patientCount === 0 && 'flex-1 w-full', 'relative')}>
          <Button
            className={cn('border-2 border-accent px-4 bg-transparent h-12 rounded-2xl gap-1.5')}
            variant="secondary"
            onPress={() => {
              vibrate('soft');
              router.push('/sync');
            }}>
            <Icon name="RotateCcw" size={16} className="text-accent" />
            <Button.Label className="text-accent text-xs font-medium">Sync</Button.Label>
          </Button>
        </View>
      </View>
    </Surface>
  );
}
