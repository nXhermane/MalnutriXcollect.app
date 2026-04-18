import { MeasureCategory } from '@/constants';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { vibrateError, vibrateSuccess } from '@/lib/utils/haptics';
import { BiologicalMeasure } from '@/schemas/biological-measure.schema';
import { getMeasureLabel } from '@/store/registry/registry.store';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { EditBiologicalMeasureSheet } from './EditBiologicalMeasureSheet';
import { MeasureCardLayout } from './MeasureCardLayout';
import { SurfaceVariant } from 'heroui-native';

interface Props {
  measure: BiologicalMeasure;
  patientId: string;
  isLocked?: boolean;
  surfaceVariant?: SurfaceVariant;
}

export function BiologicalMeasureCard({
  measure,
  patientId,
  isLocked = false,
  surfaceVariant,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { deleteMeasure, updateMeasure } = useMeasureActions();
  const toast = useToast();

  const handleSave = (value: number, unit: string) => {
    updateMeasure(patientId, measure.id, MeasureCategory.BIOLOGICAL, { value, unit });
    vibrateSuccess();
    toast.show('Success', 'Mesure biologique mise à jour');
  };

  const handleDelete = () => {
    try {
      deleteMeasure(patientId, measure.id, MeasureCategory.BIOLOGICAL);
      vibrateSuccess();
      toast.show('Success', 'Mesure biologique supprimée');
    } catch {
      vibrateError();
      toast.show('Error', 'Erreur lors de la suppression');
    }
  };

  return (
    <>
      <MeasureCardLayout
        iconName="FlaskConical"
        iconColorClass="text-danger"
        iconBgClass="bg-danger/10"
        label={getMeasureLabel(measure.code, MeasureCategory.BIOLOGICAL)}
        updatedAt={measure.updatedAt}
        trailing={
          <View className="flex-row items-baseline gap-1">
            <Text className="font-bold text-foreground text-base leading-tight">
              {measure.value}
            </Text>
            <Text className="text-muted font-medium text-xs">{measure.unit}</Text>
          </View>
        }
        onPress={!isLocked ? () => setSheetOpen(true) : undefined}
        onDelete={!isLocked ? handleDelete : undefined}
        isLocked={isLocked}
        surfaceVariant={surfaceVariant}
      />

      {!isLocked && (
        <EditBiologicalMeasureSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          measure={measure}
          onSave={handleSave}
        />
      )}
    </>
  );
}
