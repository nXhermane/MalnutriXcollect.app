import { Icon } from '@/components/shared/icons';
import {
  DepartmentRef,
  FacilityRef,
  ServiceRef,
  departments$,
  facilities$,
  services$,
} from '@/store/data/reference-data.store';
import { UserProfile } from '@/store/user/user.store';
import { useValue } from '@legendapp/state/react';
import { PressableFeedback, Surface } from 'heroui-native';
import { Text, View } from 'react-native';

export type LocationStep = 'department' | 'facility' | 'service';

export interface LocationSelection {
  department: DepartmentRef | null;
  facility: FacilityRef | null;
  service: ServiceRef | null;
}

export const FACILITY_TYPE_LABELS: Record<string, string> = {
  CNHU: 'National',
  CHD: 'Départemental',
  HZ: 'Zone',
  CSA: 'Aire de santé',
  CSCOM: 'Communautaire',
};

export const FACILITY_TYPE_COLORS: Record<string, string> = {
  CNHU: 'bg-purple-500/15 text-purple-600',
  CHD: 'bg-blue-500/15 text-blue-600',
  HZ: 'bg-accent/15 text-accent',
  CSA: 'bg-green-500/15 text-green-600',
  CSCOM: 'bg-orange-500/15 text-orange-600',
};

export const SERVICE_TYPE_ICONS: Record<string, string> = {
  NUTRITION: 'Salad',
  PEDIATRIE: 'Baby',
  NEONATOLOGIE: 'HeartPulse',
  MEDECINE_INTERNE: 'Stethoscope',
  URGENCES: 'Siren',
  GYNECO_OBSTETRIQUE: 'Heart',
  CHIRURGIE: 'Scissors',
  LABORATOIRE: 'FlaskConical',
  IMAGERIE: 'ScanLine',
  PHARMACIE: 'Pill',
  AUTRE: 'MoreHorizontal',
};

export interface InitialLocationState {
  step: LocationStep;
  selection: LocationSelection;
}

const EMPTY: InitialLocationState = {
  step: 'department',
  selection: { department: null, facility: null, service: null },
};

export function resolveInitialLocationState(profile: UserProfile | null): InitialLocationState {
  if (!profile) return EMPTY;

  const { department_id, facility_id, service_id } = profile;
  if (!department_id) return EMPTY;

  const departments = departments$.peek();
  const facilities = facilities$.peek();
  const services = services$.peek();

  const department = Array.isArray(departments)
    ? (departments.find((d) => d.id === department_id) ?? null)
    : null;

  if (!department) return EMPTY;

  if (!facility_id) {
    return {
      step: 'facility',
      selection: { department, facility: null, service: null },
    };
  }

  const facility = Array.isArray(facilities)
    ? (facilities.find((f) => f.id === facility_id) ?? null)
    : null;

  if (!facility) {
    return {
      step: 'facility',
      selection: { department, facility: null, service: null },
    };
  }

  const service =
    service_id && Array.isArray(services)
      ? (services.find((s) => s.id === service_id) ?? null)
      : null;

  return {
    step: 'service',
    selection: { department, facility, service },
  };
}

export function StepDots({ current }: { current: LocationStep }) {
  const steps: LocationStep[] = ['department', 'facility', 'service'];
  const idx = steps.indexOf(current);
  return (
    <View className="flex-row items-center gap-1.5">
      {steps.map((s, i) => (
        <View
          key={s}
          className={`rounded-full ${
            i === idx
              ? 'w-4 h-1.5 bg-accent'
              : i < idx
                ? 'w-1.5 h-1.5 bg-accent/40'
                : 'w-1.5 h-1.5 bg-border'
          }`}
        />
      ))}
    </View>
  );
}

export function LocationBreadcrumb({ selection }: { selection: LocationSelection }) {
  if (!selection.department && !selection.facility) return null;
  return (
    <View className="flex-row items-center gap-1.5 flex-wrap">
      {selection.department && (
        <View className="flex-row items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-full">
          <Icon name="MapPin" className="text-accent" sizeClassName="text-xs" />
          <Text className="text-accent text-[11px] font-semibold">{selection.department.name}</Text>
        </View>
      )}
      {selection.facility && (
        <>
          <Icon name="ChevronRight" className="text-muted/40" sizeClassName="text-xs" />
          <View className="flex-row items-center gap-1 bg-surface-secondary px-2.5 py-1 rounded-full">
            <Icon name="Building2" className="text-muted" sizeClassName="text-xs" />
            <Text className="text-muted text-[11px] font-medium">
              {selection.facility.short_name}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

interface RowItemProps {
  label: string;
  sublabel?: string;
  badge?: string;
  badgeClass?: string;
  isSelected: boolean;
  onPress: () => void;
  rightIcon?: string;
}

export function RowItem({
  label,
  sublabel,
  badge,
  badgeClass,
  isSelected,
  onPress,
  rightIcon,
}: RowItemProps) {
  return (
    <PressableFeedback onPress={onPress}>
      <Surface
        className={`flex-row items-center px-4 py-3 rounded-2xl mb-2 ${
          isSelected
            ? 'bg-accent/10 border border-accent/30'
            : 'bg-surface border border-transparent'
        }`}>
        <View className="flex-1 gap-0.5">
          <Text
            className={`text-sm font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}
            numberOfLines={1}>
            {label}
          </Text>
          {sublabel ? (
            <Text className="text-xs text-muted" numberOfLines={1}>
              {sublabel}
            </Text>
          ) : null}
        </View>
        {badge ? (
          <View className={`px-2 py-0.5 rounded-full mr-2 ${badgeClass ?? 'bg-muted/10'}`}>
            <Text className={`text-xs font-bold ${badgeClass ?? 'text-muted'}`}>{badge}</Text>
          </View>
        ) : null}
        {isSelected ? (
          <Icon name="CircleCheck" className="text-accent" sizeClassName="text-base" />
        ) : rightIcon ? (
          <Icon name={rightIcon as never} className="text-muted/40" sizeClassName="text-base" />
        ) : (
          <Icon name="ChevronRight" className="text-muted/30" sizeClassName="text-base" />
        )}
      </Surface>
    </PressableFeedback>
  );
}

interface LocationCascadeProps {
  step: LocationStep;
  selection: LocationSelection;
  onSelectDepartment: (dept: DepartmentRef) => void;
  onSelectFacility: (facility: FacilityRef) => void;
  onSelectService: (service: ServiceRef) => void;
  onSkipService?: () => void;
}

export function LocationCascade({
  step,
  selection,
  onSelectDepartment,
  onSelectFacility,
  onSelectService,
  onSkipService,
}: LocationCascadeProps) {
  const departments = useValue(() => Object.values(departments$.get()));
  const facilitiesMap = useValue(facilities$);
  const servicesMap = useValue(services$);

  const facilities = selection.department
    ? facilitiesMap.filter((f) => f.department_id === selection.department!.id)
    : [];

  const services = selection.facility
    ? servicesMap.filter((s) => s.facility_id === selection.facility!.id)
    : [];

  return (
    <>
      {step === 'department' && (
        <View>
          {departments.length === 0 ? (
            <View className="items-center py-v-8 gap-2">
              <Icon name="Loader" className="text-muted/40" sizeClassName="text-3xl" />
              <Text className="text-muted text-xs mt-2">Chargement...</Text>
            </View>
          ) : (
            departments.map((dept) => (
              <RowItem
                key={dept.id}
                label={dept.name}
                sublabel={dept.chief_town}
                isSelected={selection.department?.id === dept.id}
                onPress={() => onSelectDepartment(dept)}
              />
            ))
          )}
        </View>
      )}

      {step === 'facility' && (
        <View>
          {facilities.length === 0 ? (
            <View className="items-center py-v-8 gap-2">
              <Icon name="Building2" className="text-muted/40" sizeClassName="text-3xl" />
              <Text className="text-muted text-sm text-center">
                Aucune formation trouvée pour ce département.
              </Text>
            </View>
          ) : (
            facilities.map((fac) => (
              <RowItem
                key={fac.id}
                label={fac.name}
                sublabel={fac.short_name !== fac.name ? fac.short_name : undefined}
                badge={FACILITY_TYPE_LABELS[fac.type] ?? fac.type}
                badgeClass={FACILITY_TYPE_COLORS[fac.type]}
                isSelected={selection.facility?.id === fac.id}
                onPress={() => onSelectFacility(fac)}
              />
            ))
          )}
        </View>
      )}

      {step === 'service' && (
        <View>
          {services.length === 0 ? (
            <View className="items-center py-v-8 gap-2">
              <Icon name="Stethoscope" className="text-muted/40" sizeClassName="text-3xl" />
              <Text className="text-muted text-sm text-center">
                Aucun service trouvé pour cette formation.
              </Text>
            </View>
          ) : (
            services.map((svc) => (
              <RowItem
                key={svc.id}
                label={svc.name}
                sublabel={svc.nutrition_unit_type ? `Unité ${svc.nutrition_unit_type}` : undefined}
                badge={svc.is_mas_capable ? 'MAS' : undefined}
                badgeClass="bg-accent/15 text-accent"
                isSelected={selection.service?.id === svc.id}
                onPress={() => onSelectService(svc)}
                rightIcon={SERVICE_TYPE_ICONS[svc.service_type] ?? 'MoreHorizontal'}
              />
            ))
          )}
          {onSkipService && (
            <PressableFeedback onPress={onSkipService} className="mt-1">
              <View className="items-center py-3">
                <Text className="text-muted text-xs">
                  Passer cette étape et enregistrer sans service
                </Text>
              </View>
            </PressableFeedback>
          )}
        </View>
      )}
    </>
  );
}
