import { BlurView } from '@/components/shared/BlurView';
import { SelectField } from '@/components/shared/forms/SelectField';
import { Icon } from '@/components/shared/icons';
import { useToast } from '@/hooks/useToast';
import { EditProfileDto, editProfileSchema } from '@/schemas/edit-profile.schema';
import { PROFESSION_OPTIONS, userProfile$ } from '@/store/user/user.store';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useValue } from '@legendapp/state/react';
import {
  BottomSheet,
  Button,
  Input,
  Label,
  Spinner,
  Surface,
  TextArea,
  TextField,
} from 'heroui-native';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as v from 'valibot';

interface EditProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type FormData = {
  display_name: string;
  profession: (typeof PROFESSION_OPTIONS)[number]['value'];
  phone: string;
  bio: string;
};

export const EditProfileSheet: FC<EditProfileSheetProps> = ({ isOpen, onOpenChange }) => {
  const profile = useValue(userProfile$);
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
    if (isOpen && profile) {
      reset({
        display_name: profile.display_name ?? '',
        profession: profile.profession ?? 'nurse',
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
      });
      setSubmitError(null);
    }
  }, [isOpen, profile, reset]);

  const onSubmit = async (data: FormData) => {
    const result = v.safeParse(editProfileSchema, data);
    if (!result.success) {
      const firstIssue = result.issues[0];
      const fieldName = firstIssue.path?.[0]?.key as keyof FormData | undefined;
      if (fieldName) {
        setError(fieldName, { message: firstIssue.message });
      }
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      const dto = result.output as EditProfileDto;
      userProfile$.assign({
        display_name: dto.display_name,
        profession: dto.profession as (typeof PROFESSION_OPTIONS)[number]['value'],
        phone: dto.phone ?? null,
        bio: dto.bio ?? null,
      });
      onOpenChange(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de la mise à jour';
      setSubmitError(msg);
      toast.show('Error', 'Erreur', msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <BottomSheet.Content
          snapPoints={['80%']}
          enableDynamicSizing={false}
          enableOverDrag={false}
          enableContentPanningGesture={false}
          contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
          <View className="flex-row items-center justify-between py-v-2 border-b border-border px-4">
            <BottomSheet.Title>Éditer mon profil</BottomSheet.Title>
            <BottomSheet.Close />
          </View>

          <KeyboardAwareScrollView
            ScrollViewComponent={BottomSheetScrollView as never}
            contentContainerClassName="px-2 py-v-3 gap-v-4"
            bottomOffset={120}
            showsVerticalScrollIndicator={false}>
            <Surface variant="default" className="p-3 gap-y-4">
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
                  <Label.Text className="text-foreground text-xs font-medium">
                    Biographie
                  </Label.Text>
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
                    <Label.Text className="text-danger text-xs mt-1">
                      {errors.bio.message}
                    </Label.Text>
                  </Label>
                ) : null}
              </TextField>
            </Surface>
          </KeyboardAwareScrollView>

          <View className="px-2 pt-v-2 border-t border-border">
            {submitError ? (
              <Label className="mb-2">
                <Label.Text className="text-danger text-xs text-center">{submitError}</Label.Text>
              </Label>
            ) : null}
            <Button className="h-v-11" onPress={handleSubmit(onSubmit)} isDisabled={isSaving}>
              {isSaving ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>
                  <Icon name="Save" className="text-white" sizeClassName="text-base" />
                  <Button.Label>Enregistrer les modifications</Button.Label>
                </>
              )}
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
