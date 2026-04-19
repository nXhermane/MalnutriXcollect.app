import { Icon } from '@/components/shared/icons';
import { MeasureCategory } from '@/constants';
import { vibrate } from '@/lib/utils/haptics';
import { AnthropometricMeasure } from '@/schemas/anthropometric-measure.schema';
import { BiologicalMeasure } from '@/schemas/biological-measure.schema';
import { ClinicalFieldMeasure } from '@/schemas/clinical-field-measure.schema';
import { Visit } from '@/schemas/visit.schema';
import { measures$ } from '@/store/measures/measures.store';
import { useValue } from '@legendapp/state/react';
import { useRouter } from 'expo-router';
import { Accordion, Button, PressableFeedback, Surface } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { AnthropometricMeasureCard } from './measures/AnthropometricMeasureCard';
import { BiologicalMeasureCard } from './measures/BiologicalMeasureCard';
import { ClinicalFieldMeasureCard } from './measures/ClinicalFieldMeasureCard';

function SectionHeader({
  iconName,
  iconColorClass,
  label,
  count,
}: {
  iconName: string;
  iconColorClass: string;
  label: string;
  count: number;
}) {
  return (
    <View className="flex-row items-center gap-2 mb-1 mt-3">
      <Icon name={iconName as never} sizeClassName="text-xs" className={iconColorClass} />
      <Text className="text-2xs font-semibold uppercase tracking-wider text-muted">{label}</Text>
      <View className="flex-1 h-px bg-border/30" />
      <Text className="text-2xs text-muted">{count}</Text>
    </View>
  );
}

function DeleteAction({
  drag,
  prog,
  onDelete,
  canBeDelete,
}: {
  drag: SharedValue<number>;
  prog: SharedValue<number>;
  onDelete: () => void;
  canBeDelete: boolean;
}) {
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 70 }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: prog.value }],
    opacity: prog.value,
  }));

  return (
    <View className="flex-row">
      <Animated.View style={containerStyle} className="flex-row">
        <View className="h-full w-20 items-center justify-center bg-red-500/10 rounded-r-3xl border-l border-red-500/20">
          <Animated.View style={iconStyle}>
            <Button
              variant="danger"
              isDisabled={!canBeDelete}
              isIconOnly
              onPress={onDelete}
              className="h-10 w-10 rounded-full shadow-sm">
              <Icon name="Trash2" sizeClassName="text-base" className="text-white" />
            </Button>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

interface VisitCardProps {
  visit: Visit;
  index: number;
  total: number;
  patientId: string;
  onDelete: () => void;
}

export function VisitCard({ visit, index, total, patientId, onDelete }: VisitCardProps) {
  const router = useRouter();

  const patientMeasures = useValue(() => measures$[patientId].get());

  const anthros: AnthropometricMeasure[] = (patientMeasures?.[MeasureCategory.ANTHRO] ?? []).filter(
    (m) => visit.measureIds[MeasureCategory.ANTHRO].includes(m.id),
  );
  const clinicals: ClinicalFieldMeasure[] = (patientMeasures?.[MeasureCategory.FIELD] ?? []).filter(
    (m) => visit.measureIds[MeasureCategory.FIELD].includes(m.id),
  );
  const biologicals: BiologicalMeasure[] = (
    patientMeasures?.[MeasureCategory.BIOLOGICAL] ?? []
  ).filter((m) => visit.measureIds[MeasureCategory.BIOLOGICAL].includes(m.id));

  const totalMeasures = anthros.length + clinicals.length + biologicals.length;
  const hasMeasures = totalMeasures > 0;

  const visitNumber = total - index;
  const isToday = new Date(visit.createdAt).toDateString() === new Date().toDateString();
  const dateLabel = new Date(visit.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeLabel = new Date(visit.createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag) => (
        <DeleteAction prog={prog} drag={drag} onDelete={onDelete} canBeDelete={!visit.isLocked} />
      )}>
      <Accordion.Item value={visit.id}>
        <Accordion.Trigger asChild className="p-0">
          <Pressable>
            <Surface className="flex-row items-center justify-between gap-2">
              <View className="w-9 h-9 rounded-xl bg-accent/10 items-center justify-center shrink-0">
                <Text className="text-accent font-bold text-sm">{visitNumber}</Text>
              </View>

              <View className="flex-1 gap-0.5">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm font-semibold text-foreground">
                    Visite {visitNumber}
                  </Text>
                  {isToday && (
                    <View className="px-1.5 py-0.5 rounded-full bg-accent/10">
                      <Text className="text-2xs text-accent font-bold uppercase tracking-wider">
                        {"Aujourd'hui"}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <Icon name="Calendar" sizeClassName="text-2xs" className="text-muted" />
                    <Text className="text-2xs text-muted">{dateLabel}</Text>
                    <Text className="text-2xs text-muted/40">·</Text>
                    <Icon name="Clock" sizeClassName="text-2xs" className="text-muted/60" />
                    <Text className="text-2xs text-muted/60">{timeLabel}</Text>
                  </View>
                  {hasMeasures && (
                    <View className="flex-row items-center gap-1">
                      <Icon name="Activity" sizeClassName="text-2xs" className="text-muted" />
                      <Text className="text-2xs text-muted">
                        {totalMeasures} mesure{totalMeasures > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                {visit.isExported ? (
                  <View className="flex-row items-center gap-1 px-2 py-1 rounded-xl bg-green-500/10">
                    <Icon name="CircleCheck" sizeClassName="text-xs" className="text-green-600" />
                    <Text className="text-xs text-green-600 font-medium">Exporté</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1 px-2 py-1 rounded-xl bg-orange-500/10">
                    <Icon name="Clock" sizeClassName="text-xs" className="text-orange-500" />
                    <Text className="text-xs text-orange-500 font-medium">Non sync</Text>
                  </View>
                )}
                <Accordion.Indicator />
              </View>
            </Surface>
          </Pressable>
        </Accordion.Trigger>

        <Accordion.Content>
          {anthros.length > 0 && (
            <>
              <SectionHeader
                iconName="Ruler"
                iconColorClass="text-accent"
                label="Anthropométrie"
                count={anthros.length}
              />
              <View className="gap-1.5">
                {anthros.map((m) => (
                  <AnthropometricMeasureCard
                    key={m.id}
                    measure={m}
                    patientId={patientId}
                    isLocked={visit.isLocked || m.isLocked}
                  />
                ))}
              </View>
            </>
          )}

          {clinicals.length > 0 && (
            <>
              <SectionHeader
                iconName="Stethoscope"
                iconColorClass="text-warning"
                label="Champs cliniques"
                count={clinicals.length}
              />
              <View className="gap-1.5">
                {clinicals.map((m) => (
                  <ClinicalFieldMeasureCard
                    key={m.id}
                    measure={m}
                    patientId={patientId}
                    isLocked={visit.isLocked || m.isLocked}
                  />
                ))}
              </View>
            </>
          )}

          {biologicals.length > 0 && (
            <>
              <SectionHeader
                iconName="FlaskConical"
                iconColorClass="text-danger"
                label="Biologique"
                count={biologicals.length}
              />
              <View className="gap-1.5">
                {biologicals.map((m) => (
                  <BiologicalMeasureCard
                    key={m.id}
                    measure={m}
                    patientId={patientId}
                    isLocked={visit.isLocked || m.isLocked}
                  />
                ))}
              </View>
            </>
          )}

          {!visit.isLocked && (
            <PressableFeedback
              onPress={() => {
                vibrate('soft');
                router.push({
                  pathname: '/patient/[id]/visit-form',
                  params: { id: patientId, visitId: visit.id },
                });
              }}
              className="mt-3 flex-row items-center justify-center gap-2 py-2.5 rounded-xl bg-accent/8 active:bg-accent/15">
              <Icon name="SquarePen" sizeClassName="text-sm" className="text-accent" />
              <Text className="text-sm font-semibold text-accent">Modifier la visite</Text>
            </PressableFeedback>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </Swipeable>
  );
}
