import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import {
  Calendar,
  Edit,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  X,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import * as Hapatic from 'expo-haptics';
import { useValue } from '@legendapp/state/react';
import { modeles$ } from '@/store';
import { PatientMeasure } from '@/models/schemas';
import { Avatar, AvatarBadge, AvatarFallbackText } from '@/components/ui/avatar';
import { HumanDateFormatter } from '@/utils/human-date-formatter';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';
import { FlatList, ListRenderItemInfo, ScrollView } from 'react-native';
import { useDeletePatientMeasureViewModel } from '@/hooks';
import { Spinner } from '@/components/ui/spinner';

export default function PatientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patients = useValue(() => modeles$.patients.get());
  const [hideFab, setHideFab] = useState<boolean>(false);
  const patientMeasures = useValue(() => modeles$.patient_measures[id].get());

  const renderPatientMeasure = useCallback(
    ({ item, index }: ListRenderItemInfo<PatientMeasure>) => {
      return <PatientVisit measure={item} avatar={(patientMeasures.length - index).toString()} />;
    },
    // Use Flashlist to access to extradata and remove this
    [patientMeasures],
  );
  return (
    <React.Fragment>
      <VStack className="pt-safe flex-1 bg-bg">
        <VStack className=" h-18 w-full   items-center justify-center">
          <HStack className="w-full items-center gap-4 px-4 ">
            <Pressable
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="elevation-sm size-12 items-center justify-center rounded-full bg-card">
              <Icon as={X} className="text-muted-foreground" />
            </Pressable>
            <HStack className="elevation-sm h-12 flex-1 items-center justify-center rounded-3xl bg-card px-4">
              <Text className="text-center font-h4 text-foreground " numberOfLines={1}>
                {id ? patients[id].name : 'patient not found'}
              </Text>
            </HStack>
            <Pressable
              disabled={patients[id].isLocked}
              onPress={() => {
                router.navigate({
                  pathname: '/patient_form',
                  params: { id },
                });
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="size-12 items-center justify-center rounded-full bg-green-600 hover:bg-green-700">
              <Icon as={Edit} className="text-white" />
            </Pressable>
          </HStack>
        </VStack>
        <ScrollView
          contentContainerClassName="pb-20"
          onScrollBeginDrag={() => setHideFab(true)}
          onScrollEndDrag={() => setHideFab(false)}
          showsVerticalScrollIndicator={false}>
          <VStack className="p-4">{patients[id] && <PatientHero id={id} />}</VStack>
          <VStack className="mb-4 flex-1">
            <HStack className="items-center justify-between px-4">
              <Text className="font-h4 font-medium text-gray-700 dark:text-typography-800">
                Visites & Mesures
              </Text>
              {patientMeasures.length > 0 && (
                <Text className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-sm text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                  {patientMeasures.length} visite{patientMeasures.length > 1 ? 's' : ''}
                </Text>
              )}
            </HStack>
            <FlatList
              data={patientMeasures.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )}
              disableScrollViewPanResponder={false}
              extraData={patientMeasures.length}
              renderItem={renderPatientMeasure}
              // keyExtractor={(item) => item.id}
              contentContainerClassName="mt-5 mx-4 gap-4 "
              ListEmptyComponent={() => (
                <VStack className="rounded-xl border border-border bg-card  p-8 text-center shadow-sm ">
                  <Center className="gap-4">
                    <Box className="flex size-14 items-center justify-center rounded-full bg-background-100">
                      <Icon as={Calendar} className="size-7 text-muted-foreground" />
                    </Box>
                    <VStack className="">
                      <Text className="mb-1 text-center font-body text-foreground">
                        Aucune visite enregistrée
                      </Text>
                      <Text className="text-center font-light text-sm text-muted-foreground">
                        Ajoutez une première visite pour ce patient
                      </Text>
                    </VStack>
                  </Center>
                </VStack>
              )}
            />
          </VStack>
        </ScrollView>
        {!hideFab && (
          <Fab
            placement="bottom center"
            className="bottom-8 size-14 bg-green-600 hover:bg-green-700"
            onPress={() => {
              router.navigate({
                pathname: '/[id]/patient_measure_form',
                params: { id },
              });
              Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
            }}>
            <FabIcon as={Plus} className="text-white" />
            <FabLabel className="absolute -bottom-4 font-light text-xs  font-semibold text-foreground">
              Nouvelle visite
            </FabLabel>
          </Fab>
        )}
      </VStack>
    </React.Fragment>
  );
}

function PatientHero({ id }: { id: string }) {
  const patient = useValue(() => modeles$.patients[id].get());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };
  const getAvatarColor = (nom: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = nom.charCodeAt(0) % colors.length;
    return colors[index];
  };
  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: '/patient_form',
          params: {
            id: patient.id,
            readonly: '1',
          },
        });
      }}>
      <HStack
        className={`elevation-sm items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm`}>
        <HStack className="flex-1 items-center gap-3">
          <Avatar
            className={`flex size-11 items-center   justify-center rounded-full  bg-green-500 text-white ${getAvatarColor(
              patient.name,
            )} `}>
            <AvatarFallbackText className="font-h4 text-base font-medium text-white">
              {patient.name}
            </AvatarFallbackText>
            {patient.isLocked && (
              <AvatarBadge className=" size-4 items-center justify-center border-transparent bg-transparent">
                <Icon as={LockKeyhole} className=" size-3.5 text-amber-600 dark:text-amber-500" />
              </AvatarBadge>
            )}
          </Avatar>
          <VStack className="flex-1 pr-5">
            <Text className="font-h4 text-base font-medium text-foreground" numberOfLines={1}>
              {patient.name}
            </Text>
            <VStack>
              <HStack className="items-center gap-2 ">
                <Icon as={Calendar} className="text-muted-foreground " size="xs" />
                <Text
                  className="truncate font-light text-xs font-normal text-muted-foreground"
                  numberOfLines={1}>
                  {HumanDateFormatter.formatAgeInMonths(patient.birthdate)} •{' '}
                  {patient.sex === 'M' ? 'Masculin' : 'Féminin'}
                </Text>
              </HStack>
              <HStack className="items-center gap-2 ">
                <Icon as={User} className="text-muted-foreground " size="xs" />
                <Text
                  className="truncate font-light text-xs font-normal text-muted-foreground"
                  numberOfLines={1}>
                  {`Né${patient.sex === 'F' ? 'e' : ''}`} le {formatDate(patient.birthdate)}
                </Text>
              </HStack>
            </VStack>
            <VStack>
              {patient.contact?.tel && (
                <HStack className="items-center gap-2 ">
                  <Icon as={Phone} className="text-muted-foreground " size="xs" />
                  <Text
                    className="truncate font-light text-xs font-normal text-muted-foreground"
                    numberOfLines={1}>
                    {patient.contact.tel}
                  </Text>
                </HStack>
              )}
              {patient.contact?.email && (
                <HStack className="items-center gap-2 ">
                  <Icon as={Mail} className="text-muted-foreground" size="xs" />
                  <Text
                    className="truncate font-light text-xs font-normal text-muted-foreground"
                    numberOfLines={1}>
                    {patient.contact.email}
                  </Text>
                </HStack>
              )}
            </VStack>
            {patient.address && (
              <HStack className="items-center gap-2 ">
                <Icon as={MapPin} className="text-muted-foreground " size="xs" />
                <Text
                  className="truncate font-light text-xs font-normal text-muted-foreground"
                  numberOfLines={1}>
                  {patient.address.fullAddress || patient.address.city}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>
      </HStack>
    </Pressable>
  );
}
function PatientVisit({ avatar, measure: item }: { avatar: string; measure: PatientMeasure }) {
  const { deletePatientMeasure, isLoading } = useDeletePatientMeasureViewModel();
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  if (isLoading) return <Spinner size={'large'} className="text-blue-500" />;

  return (
    <Pressable
      onLongPress={() => {
        deletePatientMeasure(item.patientId, item.id);
      }}
      onPress={() =>
        router.navigate({
          pathname: '/[id]/patient_measure_form',
          params: { id: item.patientId, measureId: item.id, readonly: item.isExported ? '1' : '0' },
        })
      }>
      <HStack className="items-center justify-between gap-3 rounded-xl border border-border bg-card  p-4 shadow-sm  transition-all ">
        <HStack className="gap-3">
          <Avatar className="flex size-10 items-center justify-center rounded-full border border-green-200 bg-green-50 ">
            <AvatarFallbackText className="font-h4 font-medium text-green-600">
              {avatar}
            </AvatarFallbackText>
          </Avatar>
          <VStack className="gap-2">
            <Text className="font-h4 text-sm font-medium text-foreground">Visite {avatar}</Text>
            <Text className="font-body text-xs font-normal text-muted-foreground">
              {formatShortDate(item.createdAt)}
            </Text>
          </VStack>
        </HStack>

        {item.isExported ? (
          <Text className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 font-body text-xs text-green-600 ">
            ✓ Exporté
          </Text>
        ) : (
          <Text className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-body text-xs text-orange-600 ">
            À exporter
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}
