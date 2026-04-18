import { MeasureCategory } from '@/constants';
import { AnthroUnit } from '@/constants/anthropometric';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { vibrateError, vibrateSuccess } from '@/lib/utils/haptics';
import { AnthropometricMeasure } from '@/schemas/anthropometric-measure.schema';
import { getMeasureLabel } from '@/store/registry/registry.store';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { EditAnthropometricMeasureSheet } from './EditAnthropometricMeasureSheet';
import { MeasureCardLayout } from './MeasureCardLayout';
import { SurfaceVariant } from 'heroui-native';

interface Props {
  measure: AnthropometricMeasure;
  patientId: string;
  isLocked?: boolean;
  surfaceVariant?: SurfaceVariant;
}

export function AnthropometricMeasureCard({
  measure,
  patientId,
  isLocked = false,
  surfaceVariant,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { deleteMeasure, updateMeasure } = useMeasureActions();
  const toast = useToast();

  const handleSave = (value: number, unit: string) => {
    updateMeasure(patientId, measure.id, MeasureCategory.ANTHRO, {
      value,
      unit: unit as AnthroUnit,
    });
    vibrateSuccess();
    toast.show('Success', 'Mesure mise à jour');
  };

  const handleDelete = () => {
    try {
      deleteMeasure(patientId, measure.id, MeasureCategory.ANTHRO);
      vibrateSuccess();
      toast.show('Success', 'Mesure supprimée');
    } catch {
      vibrateError();
      toast.show('Error', 'Erreur lors de la suppression');
    }
  };

  return (
    <>
      <MeasureCardLayout
        iconName="Ruler"
        iconColorClass="text-accent"
        iconBgClass="bg-accent/10"
        label={getMeasureLabel(measure.code, MeasureCategory.ANTHRO)}
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
        <EditAnthropometricMeasureSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          measure={measure}
          onSave={handleSave}
        />
      )}
    </>
  );
}
