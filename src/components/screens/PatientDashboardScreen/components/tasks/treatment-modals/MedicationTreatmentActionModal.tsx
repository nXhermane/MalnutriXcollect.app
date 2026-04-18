import { Icon } from '@/components/shared/icons';
import { MarkdownText } from '@/components/shared/MarkdownText';
import type { LocalTask, SyncMedicationTreatmentAction } from '@/schemas/task.schema';
import { getTreatmentLabel } from '@/store/registry/registry.store';
import { Chip, Surface } from 'heroui-native';
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

export function MedicationTreatmentActionModal({ task, patientId, isOpen, onClose }: Props) {
  const payload = task.payload as SyncMedicationTreatmentAction;
  const title = getTreatmentLabel('medication', payload.treatmentCode);
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
      description="Traitement médicamenteux"
      typeIcon="Pill"
      iconColorClass="text-accent"
      iconBgClass="bg-accent/15"
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
          {computed && (
            <>
              <View className="rounded-xl border border-accent/20 bg-accent/5 p-4 gap-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-accent/15">
                    <Icon name="Pill" sizeClassName="text-sm" className="text-accent" />
                  </View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-accent">
                    Dose par prise
                  </Text>
                </View>
                <Text className="text-4xl font-bold text-accent">
                  {computed.totalDosePerIntake.kind === 'fixed'
                    ? computed.totalDosePerIntake.value
                    : `${computed.totalDosePerIntake.min}–${computed.totalDosePerIntake.max}`}
                  <Text className="text-lg font-normal text-accent/70">
                    {' '}
                    {computed.totalDoseUnit}
                  </Text>
                </Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <Icon name="Repeat2" sizeClassName="text-xs" className="text-muted" />
                  <Text className="text-sm text-muted">{computed.globalFrequency.label}</Text>
                </View>
              </View>

              <Surface variant="secondary" className="gap-3 p-3">
                <SectionHeader
                  icon="BarChart3"
                  label="Détails du dosage"
                  colorClass="text-accent"
                  bgClass="bg-accent/15"
                />
                <View className="flex-row gap-2 flex-wrap">
                  <StatTile
                    label="Fréquence"
                    value={computed.globalFrequency.label}
                    iconName="Repeat2"
                    accentClass="text-accent"
                  />
                  {computed.maxDurationDays && (
                    <StatTile
                      label="Durée max"
                      value={`${computed.maxDurationDays}j`}
                      iconName="Clock"
                      accentClass="text-accent"
                    />
                  )}
                  {computed.rows.length > 0 && (
                    <StatTile
                      label="Présentations"
                      value={computed.rows.length}
                      iconName="Layers"
                      accentClass="text-accent"
                    />
                  )}
                </View>
              </Surface>

              {computed.theoreticalBase && (
                <Surface variant="secondary" className="gap-3 p-3">
                  <SectionHeader
                    icon="TrendingUp"
                    label="Base théorique"
                    colorClass="text-warning"
                    bgClass="bg-warning/15"
                  />
                  <View className="rounded-lg bg-surface-tertiary px-3 py-2.5 gap-1">
                    <Text className="text-2xs text-muted">{computed.theoreticalBase.label}</Text>
                    <Text className="text-sm font-bold text-foreground">
                      {computed.theoreticalBase.dose.kind === 'fixed'
                        ? computed.theoreticalBase.dose.value
                        : `${computed.theoreticalBase.dose.min}–${computed.theoreticalBase.dose.max}`}{' '}
                      {computed.theoreticalBase.unit}
                    </Text>
                    <Text className="text-2xs text-muted">
                      {computed.theoreticalBase.frequency.label}
                    </Text>
                  </View>
                </Surface>
              )}

              <Surface variant="secondary" className="gap-3 p-3">
                <SectionHeader
                  icon="Activity"
                  label="Contexte clinique"
                  colorClass="text-warning"
                  bgClass="bg-warning/15"
                />
                <View className="flex-row flex-wrap gap-2">
                  {computed.clinicalContext.variables['weight'] !== undefined && (
                    <View className="flex-1 min-w-28 flex-row items-center gap-2 rounded-lg bg-surface-tertiary px-3 py-2.5">
                      <Icon name="Weight" sizeClassName="text-xs" className="text-warning" />
                      <View className="flex-1">
                        <Text className="text-2xs text-muted">Poids</Text>
                        <Text className="text-sm font-bold text-foreground">
                          {computed.clinicalContext.variables['weight']} kg
                        </Text>
                      </View>
                    </View>
                  )}
                  {computed.clinicalContext.weightBracketLabel && (
                    <View className="flex-row items-center gap-2 rounded-lg bg-surface-tertiary px-3 py-2.5 w-full">
                      <Icon name="ListFilter" sizeClassName="text-xs" className="text-warning" />
                      <View className="flex-1">
                        <Text className="text-2xs text-muted">Tranche de poids</Text>
                        <Text className="text-sm font-bold text-foreground">
                          {computed.clinicalContext.weightBracketLabel}
                        </Text>
                      </View>
                    </View>
                  )}
                  {computed.clinicalContext.appliedConditionDescription && (
                    <View className="flex-row items-center gap-2 rounded-lg bg-surface-tertiary px-3 py-2.5 w-full">
                      <Icon name="Stethoscope" sizeClassName="text-xs" className="text-warning" />
                      <View className="flex-1">
                        <Text className="text-2xs text-muted">Condition appliquée</Text>
                        <Text className="text-sm font-bold text-foreground">
                          {computed.clinicalContext.appliedConditionDescription}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </Surface>

              {computed.rows.length > 0 && (
                <Surface variant="secondary" className="gap-3 p-3">
                  <SectionHeader
                    icon="Package"
                    label="Présentations"
                    colorClass="text-success"
                    bgClass="bg-success/15"
                  />
                  <View className="gap-2">
                    {computed.rows.map((row) => (
                      <View
                        key={row.presentationCode}
                        className="rounded-xl bg-surface-tertiary p-3 gap-2">
                        <Text className="font-semibold text-sm text-foreground">
                          {row.presentationLabel}
                        </Text>
                        <View className="flex-row flex-wrap gap-1.5">
                          {row.form && (
                            <Chip size="sm" variant="primary" color="accent">
                              <Chip.Label>{row.form}</Chip.Label>
                            </Chip>
                          )}
                          <Chip size="sm" variant="secondary" color="accent">
                            <Chip.Label>Voie {row.route}</Chip.Label>
                          </Chip>
                          <Chip size="sm" variant="soft" color="default">
                            <Chip.Label>{row.frequency.label}</Chip.Label>
                          </Chip>
                        </View>
                        <View className="flex-row items-center justify-between rounded-lg border border-border/50 bg-surface-secondary px-3 py-2">
                          <View>
                            <Text className="text-2xs text-muted">Dose / prise</Text>
                            <Text className="text-sm font-bold text-foreground">
                              {row.displayFraction ??
                                (row.dosePerIntake.kind === 'fixed'
                                  ? `${row.dosePerIntake.value} ${row.unit}`
                                  : `${row.dosePerIntake.min}–${row.dosePerIntake.max} ${row.unit}`)}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-2xs text-muted">Dose / jour</Text>
                            <Text className="text-sm font-medium text-foreground">
                              {row.dailyDose.kind === 'fixed'
                                ? row.dailyDose.value
                                : `${row.dailyDose.min}–${row.dailyDose.max}`}{' '}
                              {row.dailyDoseUnit}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </Surface>
              )}

              {computed.clinicalNotes && (
                <Surface variant="secondary" className="gap-3 p-3">
                  <SectionHeader
                    icon="BookOpen"
                    label="Notes cliniques"
                    colorClass="text-muted"
                    bgClass="bg-muted/15"
                  />
                  <MarkdownText markdown={computed.clinicalNotes} />
                </Surface>
              )}
            </>
          )}
        </View>
      )}
    </TreatmentActionModalLayout>
  );
}
