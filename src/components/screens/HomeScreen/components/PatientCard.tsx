import { Icon } from '@/components/shared/icons';
import { usePatientActions } from '@/hooks/usePatientActions';
import { useToast } from '@/hooks/useToast';
import { formatAgeInMonths } from '@/lib/utils/date';
import { vibrate, vibrateError, vibrateSuccess } from '@/lib/utils/haptics';
import { logger } from '@/lib/utils/logger';
import { Patient, Sex } from '@/schemas';
import { visits$ } from '@/store/visits/visits.store';
import { Observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { Avatar, Button, PressableFeedback, Surface } from 'heroui-native';
import React from 'react';
import { LayoutAnimation, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  onDelete: () => void,
  onDeleteExported: () => void,
): React.ReactNode {
  const styleAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 70 }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: prog.value }],
    opacity: prog.value,
  }));
  return (
    <View className="flex-row">
      <Reanimated.View style={styleAnimation} className="flex-row">
        <View className="h-full w-20 items-center justify-center bg-red-500/10 rounded-r-3xl border-l border-red-500/20">
          <Reanimated.View style={iconStyle}>
            <Button
              variant="danger"
              isIconOnly
              onPress={onDelete}
              onLongPress={onDeleteExported}
              className="h-10 w-10 rounded-full shadow-sm">
              <Icon name={'Trash2'} sizeClassName="text-lg" className="text-white" />
            </Button>
          </Reanimated.View>
        </View>
      </Reanimated.View>
    </View>
  );
}

interface PatientCardProps {
  patient$: Observable<Patient>;
  onPress: (id: string) => void;
}

const PatientCardComponent = ({ patient$, onPress }: PatientCardProps) => {
  const toast = useToast();
  const patient = useValue(patient$);
  const visitCount = useValue(() => (visits$[patient.id].get() ?? []).length);
  const { deletePatient } = usePatientActions();
  const handleDelete = React.useCallback(async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const res = deletePatient(patient.id);
      if (res === null) {
        vibrateError();
        toast.show('Error', 'Patient non trouvé');
        return;
      }
      if (res === false) {
        vibrateError();
        toast.show(
          'Info',
          'Patient déjà exporté',
          'Effectuer un appui long pour forcer la suppression',
          'top',
          undefined,
          {
            actionLabel: undefined,
          },
        );
        return;
      }
      vibrateSuccess();
      toast.show('Success', 'Patient supprimé');
    } catch (error) {
      vibrateError();
      logger.error('Failed to delete patient', error);
      toast.show('Error', 'Erreur lors de la suppression');
    }
  }, [patient.id, toast, deletePatient]);
  const handleDeleteExportedPatient = React.useCallback(async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const res = deletePatient(patient.id, true);
      if (!res) {
        vibrateError();
        toast.show('Error', 'Patient non trouvé');
        return;
      }
      vibrateSuccess();
      toast.show('Success', 'Patient supprimé');
    } catch (error) {
      vibrateError();
      logger.error('Failed to delete patient', error);
      toast.show('Error', 'Erreur lors de la suppression');
    }
  }, [patient.id, toast, deletePatient]);

  const initials = patient.name
    .split(' ')
    .map((n, i) => (i <= 1 ? n.charAt(0).toUpperCase() : ''))
    .join('');

  const isMale = patient.sex === Sex.MALE;

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag) =>
        RightAction(prog, drag, handleDelete, handleDeleteExportedPatient)
      }>
      <PressableFeedback
        onPress={() => {
          onPress(patient.id);
          vibrate('soft');
        }}>
        <Surface>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl" alt={patient.name}>
                <Avatar.Fallback className={isMale ? 'bg-blue-500/10' : 'bg-pink-500/10'}>
                  <Text
                    className={`text-lg font-bold ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>
                    {initials}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
              <View className="flex-col gap-1">
                <Text className="text-base font-bold text-foreground">{patient.name}</Text>
                <View className="flex-row items-center gap-2">
                  <View
                    className={`px-2 py-0.5 rounded-md ${isMale ? 'bg-blue-500/10' : 'bg-pink-500/10'}`}>
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-wider ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>
                      {isMale ? 'MASCULIN' : 'FÉMININ'}
                    </Text>
                  </View>
                  <Text className="text-muted text-xs font-medium">
                    {formatAgeInMonths(new Date(patient.birthdate))}
                  </Text>
                </View>
              </View>
            </View>
            {patient.isLocked && (
              <View className="px-2 py-1 rounded-xl bg-muted/10">
                <Text className="text-muted text-xs font-medium">Exporté</Text>
              </View>
            )}
            {visitCount > 0 && (
              <View className="px-2 py-1 rounded-xl bg-accent/10">
                <Text className="text-accent text-xs font-bold">{visitCount}</Text>
              </View>
            )}
          </View>
        </Surface>
      </PressableFeedback>
    </Swipeable>
  );
};

export const PatientCard = React.memo(PatientCardComponent);
PatientCard.displayName = 'PatientCard';
