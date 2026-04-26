import { BlurView } from '@/components/shared/BlurView';
import { SelectField } from '@/components/shared/forms/SelectField';
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
import { editProfileSchema } from '@/schemas/edit-profile.schema';
import { DepartmentRef, FacilityRef, ServiceRef } from '@/store/data/reference-data.store';
import { PROFESSION_OPTIONS, userProfile$ } from '@/store/user/user.store';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useValue } from '@legendapp/state/react';
import {
  BottomSheet,
  Button,
  Input,
  Label,
  PressableFeedback,
  Spinner,
  Surface,
  TextArea,
  TextField,
} from 'heroui-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as v from 'valibot';

interface EditProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type Tab = 'profile' | 'location';

type FormData = {
  display_name: string;
  profession: (typeof PROFESSION_OPTIONS)[number]['value'];
  phone: string;
  bio: string;
};

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <View className="flex-row gap-2 px-4 pb-v-2">
      {(['profile', 'location'] as Tab[]).map((tab) => (
        <PressableFeedback key={tab} onPress={() => onChange(tab)} className="flex-1">
          <View
            className={`h-9 rounded-xl items-center justify-center flex-row gap-1.5 ${
              active === tab ? 'bg-accent' : 'bg-surface-secondary'
            }`}>
            <Icon
              name={tab === 'profile' ? 'User' : 'MapPin'}
              sizeClassName="text-xs"
              className={active === tab ? 'text-white' : 'text-muted'}
            />
            <Text
              className={`text-xs font-semibold ${active === tab ? 'text-white' : 'text-muted'}`}>
              {tab === 'profile' ? 'Profil' : 'Localisation'}
            </Text>
          </View>
        </PressableFeedback>
      ))}
    </View>
  );
}

function EditProfileSheetContent({ onClose }: { onClose: () => void }) {
  const profile = useValue(userProfile$);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      display_name: '',
      profession: 'nurse',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        display_name: profile.display_name ?? '',
        profession: profile.profession ?? 'nurse',
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
      });
      setSubmitError(null);
      setActiveTab('profile');
    }
  }, [profile, reset]);

  const onSubmitProfile = async (data: FormData) => {
    const result = v.safeParse(editProfileSchema, data);
    if (!result.success) {
      const firstIssue = result.issues[0];
      const fieldName = firstIssue.path?.[0]?.key as keyof FormData | undefined;
      if (fieldName) setError(fieldName, { message: firstIssue.message });
      return;
    }
    setIsSaving(true);
    setSubmitError(null);
    try {
      const dto = result.output;
      userProfile$.assign({
        display_name: dto.display_name,
        profession: dto.profession as (typeof PROFESSION_OPTIONS)[number]['value'],
        phone: dto.phone ?? null,
        bio: dto.bio ?? null,
      });
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de la mise à jour';
      setSubmitError(msg);
      toast.show('Error', 'Erreur', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const [locationStep, setLocationStep] = useState<LocationStep>('department');
  const [locationSelection, setLocationSelection] = useState<LocationSelection>({
    department: null,
    facility: null,
    service: null,
  });

  useEffect(() => {
    if (!profile) return;
    const state = resolveInitialLocationState(profile);
    setLocationStep(state.step);
    setLocationSelection(state.selection);
  }, [profile]);
  const handleSelectDepartment = (dept: DepartmentRef) => {
    setLocationSelection({ department: dept, facility: null, service: null });
    setLocationStep('facility');
  };

  const handleSelectFacility = (facility: FacilityRef) => {
    setLocationSelection((prev) => ({ ...prev, facility, service: null }));
    setLocationStep('service');
  };

  const handleSelectService = (service: ServiceRef) => {
    setLocationSelection((prev) => ({ ...prev, service }));
  };

  const handleLocationBack = () => {
    if (locationStep === 'facility') {
      setLocationStep('department');
      setLocationSelection((prev) => ({ ...prev, facility: null, service: null }));
    } else if (locationStep === 'service') {
      setLocationStep('facility');
      setLocationSelection((prev) => ({ ...prev, service: null }));
    }
  };

  const handleSaveLocation = async () => {
    if (!locationSelection.department) return;
    setIsSaving(true);
    try {
      userProfile$.assign({
        department_id: locationSelection.department.id,
        health_zone_id: locationSelection.facility?.health_zone_id ?? null,
        facility_id: locationSelection.facility?.id ?? null,
        service_id: locationSelection.service?.id ?? null,
      });
      onClose();
      toast.show('Success', 'Localisation mise à jour', 'Votre rattachement a été enregistré.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de la mise à jour';
      toast.show('Error', 'Erreur', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const locationSubtitles: Record<LocationStep, string> = {
    department: 'Sélectionnez votre département',
    facility: `Formations dans ${locationSelection.department?.name ?? ''}`,
    service: `Services de ${locationSelection.facility?.short_name ?? locationSelection.facility?.name ?? ''}`,
  };

  const LOCATION_STEP_TITLES: Record<LocationStep, string> = {
    department: 'Département',
    facility: 'Formation sanitaire',
    service: 'Service',
  };

  return (
    <BottomSheet.Content
      snapPoints={['85%']}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enableContentPanningGesture={false}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
      <View className="flex-row items-center justify-between py-v-2 border-b border-border px-4 mb-v-2">
        <BottomSheet.Title>Éditer mon profil</BottomSheet.Title>
        <BottomSheet.Close />
      </View>

      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' && (
        <KeyboardAwareScrollView
          ScrollViewComponent={BottomSheetScrollView as never}
          contentContainerClassName="px-2 py-v-3 gap-v-4"
          showsVerticalScrollIndicator={false}>
          <Surface variant="default" className="p-2 gap-y-4">
            <TextField>
              <Label>
                <Label.Text className="text-foreground text-sm font-medium">
                  {"Nom d'affichage"}
                  <Label.Text className="text-danger"> *</Label.Text>
                </Label.Text>
              </Label>
              <Controller
                control={control}
                name="display_name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Ex: Marie Dupont"
                    value={value}
                    onChangeText={onChange}
                    isDisabled={isSaving}
                    isInvalid={!!errors.display_name}
                    className="px-2"
                  />
                )}
              />
              {errors.display_name ? (
                <Label>
                  <Label.Text className="text-danger text-xs mt-1">
                    {errors.display_name.message}
                  </Label.Text>
                </Label>
              ) : null}
            </TextField>

            <SelectField
              control={control as never}
              field={{
                type: 'select',
                name: 'profession',
                label: 'Profession',
                options: PROFESSION_OPTIONS as never,
                placeholder: 'Sélectionner une profession',
                default: 'nurse',
              }}
              errors={errors}
              readonly={isSaving}
            />

            <TextField>
              <Label>
                <Label.Text className="text-foreground text-xs font-medium">Téléphone</Label.Text>
              </Label>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="+229 01 XX XX XX XX"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    isDisabled={isSaving}
                    className="px-2"
                  />
                )}
              />
            </TextField>

            <TextField>
              <Label>
                <Label.Text className="text-foreground text-xs font-medium">Biographie</Label.Text>
              </Label>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    placeholder="Parlez de votre parcours..."
                    value={value}
                    onChangeText={onChange}
                    isDisabled={isSaving}
                    className="px-2"
                  />
                )}
              />
              {errors.bio ? (
                <Label>
                  <Label.Text className="text-danger text-xs mt-1">{errors.bio.message}</Label.Text>
                </Label>
              ) : null}
            </TextField>
          </Surface>
        </KeyboardAwareScrollView>
      )}

      {activeTab === 'location' && (
        <>
          <View className="px-2 pb-v-2 border-b border-border gap-2 mb-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                {locationStep !== 'department' ? (
                  <PressableFeedback
                    onPress={handleLocationBack}
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
                  <Text className="text-foreground font-bold text-sm leading-tight">
                    {LOCATION_STEP_TITLES[locationStep]}
                  </Text>
                  <Text className="text-muted text-xs" numberOfLines={1}>
                    {locationSubtitles[locationStep]}
                  </Text>
                </View>
              </View>
              <StepDots current={locationStep} />
            </View>
            <LocationBreadcrumb selection={locationSelection} />
          </View>

          <BottomSheetScrollView
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: 16,
            }}
            showsVerticalScrollIndicator={false}>
            <LocationCascade
              step={locationStep}
              selection={locationSelection}
              onSelectDepartment={handleSelectDepartment}
              onSelectFacility={handleSelectFacility}
              onSelectService={handleSelectService}
              onSkipService={handleSaveLocation}
            />
          </BottomSheetScrollView>
        </>
      )}

      <View className="px-4 pt-v-2">
        {submitError ? (
          <Label className="mb-2">
            <Label.Text className="text-danger text-xs text-center">{submitError}</Label.Text>
          </Label>
        ) : null}

        {activeTab === 'profile' && (
          <Button className="h-v-11" onPress={handleSubmit(onSubmitProfile)} isDisabled={isSaving}>
            {isSaving ? (
              <Spinner size="sm" color="white" />
            ) : (
              <>
                <Icon name="Save" className="text-white" sizeClassName="text-base" />
                <Button.Label className="text-white">Enregistrer les modifications</Button.Label>
              </>
            )}
          </Button>
        )}

        {activeTab === 'location' && locationSelection.department && (
          <Button className="h-v-11" onPress={handleSaveLocation} isDisabled={isSaving}>
            {isSaving ? (
              <Spinner size="sm" color="white" />
            ) : (
              <>
                <Icon name="Save" className="text-white" sizeClassName="text-base" />
                <Button.Label className="text-white">
                  {locationStep === 'service' && locationSelection.service
                    ? 'Enregistrer ma localisation'
                    : locationStep === 'service'
                      ? 'Enregistrer sans service'
                      : 'Enregistrer le département'}
                </Button.Label>
              </>
            )}
          </Button>
        )}
      </View>
    </BottomSheet.Content>
  );
}

export const EditProfileSheet = ({ isOpen, onOpenChange }: EditProfileSheetProps) => {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <EditProfileSheetContent onClose={() => onOpenChange(false)} />
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
