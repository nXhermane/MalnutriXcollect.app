import { Icon } from '@/components/shared/icons';
import { MeasureCategory } from '@/constants';
import { dataFieldRefs } from '@/data/fields';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { vibrateError, vibrateSuccess } from '@/lib/utils/haptics';
import { ClinicalFieldMeasure, ClinicalFieldValue } from '@/schemas/clinical-field-measure.schema';
import { getMeasureLabel } from '@/store/registry/registry.store';
import { Chip, SurfaceVariant } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { EditClinicalFieldMeasureSheet } from './EditClinicalFieldMeasureSheet';
import { MeasureCardLayout } from './MeasureCardLayout';

interface Props {
  measure: ClinicalFieldMeasure;
  patientId: string;
  isLocked?: boolean;
  surfaceVariant?: SurfaceVariant;
}

function ClinicalValueDisplay({ value }: { value: ClinicalFieldValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Chip size="sm" color="success" variant="soft">
        <Icon name="Check" sizeClassName="text-xs" className="text-success" />
        <Chip.Label className="text-xs">Oui</Chip.Label>
      </Chip>
    ) : (
      <Chip size="sm" variant="tertiary">
        <Icon name="X" sizeClassName="text-xs" className="text-foreground" />
        <Chip.Label className="text-xs">Non</Chip.Label>
      </Chip>
    );
  }
  if (typeof value === 'number') {
    return <Text className="font-bold text-foreground text-base">{value}</Text>;
  }
  if (typeof value === 'string') {
    return <Text className="font-bold text-foreground text-sm">{value}</Text>;
  }
  if (typeof value === 'object' && 'value' in value && 'unit' in value) {
    return (
      <View className="flex-row items-baseline gap-1">
        <Text className="font-bold text-foreground text-base">{value.value}</Text>
        <Text className="text-muted text-xs">{value.unit}</Text>
      </View>
    );
  }
  return null;
}

export function ClinicalFieldMeasureCard({
  measure,
  patientId,
  isLocked = false,
  surfaceVariant,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { deleteMeasure, updateMeasure } = useMeasureActions();
  const toast = useToast();

  const fieldRef = dataFieldRefs.find((r) => r.code === measure.code);

  const handleSave = (value: ClinicalFieldValue) => {
    updateMeasure(patientId, measure.id, MeasureCategory.FIELD, { value });
    vibrateSuccess();
    toast.show('Success', 'Champ clinique mis à jour');
  };

  const handleDelete = () => {
    try {
      deleteMeasure(patientId, measure.id, MeasureCategory.FIELD);
      vibrateSuccess();
      toast.show('Success', 'Champ clinique supprimé');
    } catch {
      vibrateError();
      toast.show('Error', 'Erreur lors de la suppression');
    }
  };

  return (
    <>
      <MeasureCardLayout
        iconName="Stethoscope"
        iconColorClass="text-warning"
        iconBgClass="bg-warning/10"
        label={getMeasureLabel(measure.code, MeasureCategory.FIELD)}
        updatedAt={measure.updatedAt}
        trailing={<ClinicalValueDisplay value={measure.value} />}
        onPress={!isLocked ? () => setSheetOpen(true) : undefined}
        onDelete={!isLocked ? handleDelete : undefined}
        isLocked={isLocked}
        surfaceVariant={surfaceVariant}
      />

      {!isLocked && fieldRef && (
        <EditClinicalFieldMeasureSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          measure={measure}
          fieldRef={fieldRef}
          onSave={handleSave}
        />
      )}
    </>
  );
}
