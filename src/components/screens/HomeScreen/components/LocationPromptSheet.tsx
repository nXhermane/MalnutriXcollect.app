import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import {
  LocationBreadcrumb,
  LocationCascade,
  LocationSelection,
  LocationStep,
  StepDots,
  resolveInitialLocationState,
} from '@/components/shared/location/location-cascade';
import { useToast } from '@/hooks/useToast';
import { DepartmentRef, FacilityRef, ServiceRef } from '@/store/data/reference-data.store';
import { locationPrompt$ } from '@/store/ui/home.store';
import { userProfile$ } from '@/store/user/user.store';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { batch } from '@legendapp/state';
import { useEffectOnce, useValue } from '@legendapp/state/react';
import { BottomSheet, PressableFeedback, Spinner } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const STEP_TITLES: Record<LocationStep, string> = {
  department: 'Votre département',
  facility: 'Votre formation sanitaire',
  service: 'Votre service',
};

export function LocationPromptSheet() {
  const isOpen = useValue(() => locationPrompt$.showLocationSheet.get());
  const profile = useValue(userProfile$);
  const toast = useToast();

  useEffectOnce(() => {
    if (locationPrompt$.shouldShowLocationSheet.get()) {
      setTimeout(() => {
        batch(() => {
          locationPrompt$.showLocationSheet.set(true);
          locationPrompt$.shouldShowLocationSheet.set(false);
        });
      }, 600);
    }
  }, []);

  const [step, setStep] = useState<LocationStep>(() => resolveInitialLocationState(profile).step);
  const [selection, setSelection] = useState<LocationSelection>(
    () => resolveInitialLocationState(profile).selection,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const state = resolveInitialLocationState(profile);
      setStep(state.step);
      setSelection(state.selection);
    }
  }, [isOpen, profile]);

  const handleClose = () => locationPrompt$.showLocationSheet.set(false);

  const handleSelectDepartment = (dept: DepartmentRef) => {
    setSelection({ department: dept, facility: null, service: null });
    setStep('facility');
  };

  const handleSelectFacility = (facility: FacilityRef) => {
    setSelection((prev) => ({ ...prev, facility, service: null }));
    setStep('service');
  };

  const handleSelectService = (service: ServiceRef) => {
    setSelection((prev) => ({ ...prev, service }));
  };

  const handleBack = () => {
    if (step === 'facility') {
      setStep('department');
      setSelection((prev) => ({ ...prev, facility: null, service: null }));
    } else if (step === 'service') {
      setStep('facility');
      setSelection((prev) => ({ ...prev, service: null }));
    }
  };

  const handleSave = async () => {
    if (!selection.department) return;
    setIsSaving(true);
    try {
      userProfile$.assign({
        department_id: selection.department.id,
        health_zone_id: selection.facility?.health_zone_id ?? null,
        facility_id: selection.facility?.id ?? null,
        service_id: selection.service?.id ?? null,
      });
      locationPrompt$.showLocationSheet.set(false);
      toast.show('Success', 'Profil mis à jour', 'Votre localisation a été enregistrée.');
    } catch {
      toast.show('Error', 'Erreur', "Impossible d'enregistrer votre localisation.");
    } finally {
      setIsSaving(false);
    }
  };

  const subtitles: Record<LocationStep, string> = {
    department: 'Sélectionnez le département où vous exercez',
    facility: `Formations dans ${selection.department?.name ?? ''}`,
    service: `Services de ${selection.facility?.short_name ?? selection.facility?.name ?? ''}`,
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <BottomSheet.Content
          snapPoints={['85%']}
          enableDynamicSizing={false}
          enableOverDrag={false}
          enableContentPanningGesture={false}
          contentContainerClassName="py-0 px-0 pb-0 h-full">
          <View className="px-2 pt-v-2 pb-v-3 border-b border-border gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                {step !== 'department' ? (
                  <PressableFeedback
                    onPress={handleBack}
                    className="size-8 items-center justify-center rounded-xl bg-surface-secondary active:bg-surface">
                    <Icon
                      name="ChevronLeft"
                      className="text-foreground"
                      sizeClassName="text-base"
                    />
                  </PressableFeedback>
                ) : (
                  <View className="size-8 items-center justify-center rounded-xl bg-accent/10">
                    <Icon name="MapPin" className="text-accent" sizeClassName="text-base" />
                  </View>
                )}
                <View>
                  <Text className="text-foreground font-bold text-base leading-tight">
                    {STEP_TITLES[step]}
                  </Text>
                  <Text className="text-muted text-xs" numberOfLines={1}>
                    {subtitles[step]}
                  </Text>
                </View>
              </View>
              <View className="items-end gap-1.5">
                <PressableFeedback onPress={handleClose}>
                  <Text className="text-xs font-medium text-accent">Plus tard</Text>
                </PressableFeedback>
                <StepDots current={step} />
              </View>
            </View>
            <LocationBreadcrumb selection={selection} />
          </View>

          <BottomSheetScrollView
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}>
            <LocationCascade
              step={step}
              selection={selection}
              onSelectDepartment={handleSelectDepartment}
              onSelectFacility={handleSelectFacility}
              onSelectService={handleSelectService}
              onSkipService={handleSave}
            />
          </BottomSheetScrollView>

          {selection.department && (
            <View className="px-3 pt-v-3 pb-v-4 border-[0.5px] border-border rounded-t-3xl">
              <PressableFeedback
                onPress={handleSave}
                className={`h-v-11 rounded-2xl items-center justify-center flex-row gap-2 ${
                  isSaving ? 'bg-accent/60' : 'bg-accent'
                }`}>
                {isSaving ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <Icon name="Save" className="text-white" sizeClassName="text-base" />
                    <Text className="text-white font-semibold text-sm">
                      {step === 'service' && selection.service
                        ? 'Enregistrer ma localisation'
                        : step === 'service'
                          ? 'Enregistrer sans service'
                          : 'Enregistrer le département'}
                    </Text>
                  </>
                )}
              </PressableFeedback>
            </View>
          )}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
