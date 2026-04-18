import { Icon } from '@/components/shared/icons';
import type { LocalTask, SyncNutritionalTreatmentAction } from '@/schemas/task.schema';
import { getTreatmentLabel } from '@/store/registry/registry.store';
import { Surface } from 'heroui-native';
import { Text, View } from 'react-native';
import { OnCompletionTasksSection } from './shared/OnCompletionTasksSection';
import { SectionHeader } from './shared/SectionHeader';
import { StatTile } from './shared/StatTile';
import { TreatmentActionModalLayout } from './shared/TreatmentActionModalLayout';

interface Props {
  task: LocalTask;
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NutritionalTreatmentActionModal({ task, patientId, isOpen, onClose }: Props) {
  const payload = task.payload as SyncNutritionalTreatmentAction;
  const title = getTreatmentLabel('nutritional', payload.treatmentCode);
  const computed = payload.resolvedDosage?.dosage.computedDosage;

  const requiredFields = payload.onCompletionTasks.flatMap((t) => t.fields);
  const collectedCodes = new Set(task.collectedFields.map((f) => f.fieldCode));
  const isFullyCollected =
    requiredFields.length === 0 || requiredFields.every((f) => collectedCodes.has(f));

  return (
    <TreatmentActionModalLayout
      isOpen={isOpen}
      onClose={onClose}
      task={task}
      title={title}
      description="Supplément nutritionnel"
      typeIcon="Milk"
      iconColorClass="text-success"
      iconBgClass="bg-success/15"
      isFullyCollected={isFullyCollected}
      emptyState={
        !payload.resolvedDosage
          ? {
              isMissing: true,
              title: 'Aucun dosage calculé',
              description: 'Le dosage sera disponible après la prochaine synchronisation.',
            }
          : undefined
      }
      completionTasksSection={
        payload.onCompletionTasks.length > 0 ? (
          <OnCompletionTasksSection task={task} patientId={patientId} />
        ) : undefined
      }>
      {payload.resolvedDosage && (
        <View className="gap-3">
          <View className="rounded-xl border border-success/20 bg-success/5 p-4 gap-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-success/15">
                <Icon name="Milk" sizeClassName="text-sm" className="text-success" />
              </View>
              <Text className="text-xs font-bold uppercase tracking-wider text-success">
                Dosage recommandé
              </Text>
            </View>
            <Text className="text-4xl font-bold text-success">
              {payload.resolvedDosage.dosage.dosage.value}
              <Text className="text-lg font-normal text-success/70">
                {' '}
                {payload.resolvedDosage.dosage.dosage.unit}
              </Text>
            </Text>
          </View>

          {computed && (
            <>
              <Surface variant="secondary" className="gap-3 p-3">
                <SectionHeader
                  icon="Scale"
                  label="Dosage pratique"
                  colorClass="text-accent"
                  bgClass="bg-accent/15"
                />
                <View className="flex-row gap-2">
                  {computed.practicalPrescription.totalPerDay && (
                    <StatTile
                      label="Total / jour"
                      value={computed.practicalPrescription.totalPerDay}
                      unit={computed.practicalPrescription.unit}
                      iconName="Sun"
                      accentClass="text-accent"
                    />
                  )}
                  {computed.practicalPrescription.totalPerWeek && (
                    <StatTile
                      label="Total / semaine"
                      value={computed.practicalPrescription.totalPerWeek}
                      unit={computed.practicalPrescription.unit}
                      iconName="CalendarDays"
                      accentClass="text-accent"
                    />
                  )}
                </View>

                {computed.practicalPrescription.mealDistributions &&
                  computed.practicalPrescription.mealDistributions.length > 0 && (
                    <View className="gap-2">
                      <Text className="text-xs text-muted font-medium">Distribution par repas</Text>
                      {computed.practicalPrescription.mealDistributions.map((meal) => (
                        <View
                          key={meal.frequency}
                          className="flex-row items-center justify-between rounded-lg bg-surface-tertiary px-3 py-2.5">
                          <View className="flex-row items-center gap-2">
                            <Icon
                              name="UtensilsCrossed"
                              sizeClassName="text-xs"
                              className="text-muted"
                            />
                            <Text className="text-sm text-foreground font-medium">
                              {meal.frequency} repas / jour
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-sm font-bold text-success">
                              {meal.dosePerMeal}
                            </Text>
                            <Text className="text-2xs text-muted">
                              {computed.practicalPrescription.unit} / repas
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
              </Surface>

              <Surface variant="secondary" className="gap-3 p-3">
                <SectionHeader
                  icon="Target"
                  label="Cible théorique"
                  colorClass="text-warning"
                  bgClass="bg-warning/15"
                />
                <View className="flex-row gap-2">
                  <StatTile
                    label="Minimum"
                    value={computed.theoreticalTarget.min}
                    unit={computed.theoreticalTarget.unit}
                    iconName="ArrowDown"
                    accentClass="text-warning"
                  />
                  {computed.theoreticalTarget.max && (
                    <StatTile
                      label="Maximum"
                      value={computed.theoreticalTarget.max}
                      unit={computed.theoreticalTarget.unit}
                      iconName="ArrowUp"
                      accentClass="text-warning"
                    />
                  )}
                </View>
              </Surface>

              <Surface variant="secondary" className="gap-3 p-3">
                <SectionHeader
                  icon="Activity"
                  label="Contexte clinique"
                  colorClass="text-warning"
                  bgClass="bg-warning/15"
                />
                <View className="flex-row items-center gap-2 rounded-lg bg-surface-tertiary px-3 py-2.5">
                  <Icon name="Weight" sizeClassName="text-xs" className="text-warning" />
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-2xs text-muted">Poids utilisé</Text>
                      {computed.clinicalContext.isAdmissionWeight && (
                        <Text className="text-2xs text-warning font-medium">(Admission)</Text>
                      )}
                    </View>
                    <Text className="text-sm font-bold text-foreground">
                      {computed.clinicalContext.weightUsed} kg
                    </Text>
                  </View>
                </View>
              </Surface>
            </>
          )}
        </View>
      )}
    </TreatmentActionModalLayout>
  );
}
