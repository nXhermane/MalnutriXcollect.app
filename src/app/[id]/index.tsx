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
import React, { useCallback } from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import * as Hapatic from 'expo-haptics';
import { useValue } from '@legendapp/state/react';
import { modeles$ } from '@/store';
import { Patient, PatientMeasure } from '@/models/schemas';
import { Avatar, AvatarBadge, AvatarFallbackText } from '@/components/ui/avatar';
import { HumanDateFormatter } from '@/utils/human-date-formatter';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';
import { FlatList, ListRenderItemInfo } from 'react-native';

export default function PatientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patients = useValue(() => modeles$.patients);
  const nonExportedCount = useValue(
    () => modeles$.patient_measures[id].get().filter((m) => !m.isExported).length,
  );
  const patientMeasures = useValue(() => modeles$.patient_measures[id].get());
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  const renderPatientMeasure = useCallback(
    ({ item, index }: ListRenderItemInfo<PatientMeasure>) => {
      return (
        <HStack className="items-center justify-between gap-3 rounded-xl border-gray-100 bg-background-0 p-4 shadow-sm dark:bg-background-50">
          <HStack className="gap-3">
            <Avatar className="flex size-10 items-center justify-center rounded-full border border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/20">
              <AvatarFallbackText className="font-h4 font-medium text-green-600 dark:text-green-50">
                {(patientMeasures.length - index).toString()}
              </AvatarFallbackText>
            </Avatar>
            <VStack>
              <Text className="font-h4 text-sm font-medium text-gray-900 dark:text-typography-900">
                Visite {patientMeasures.length - index}
              </Text>
              <Text className="font-body text-xs font-normal text-gray-500 dark:text-typography-500">
                {formatShortDate(item.createdAt)}
              </Text>
            </VStack>
          </HStack>

          {item.isExported ? (
            <Text className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 font-body text-xs text-green-600 dark:border-green-100/20 dark:bg-green-600/10 dark:text-green-600">
              ✓ Exporté
            </Text>
          ) : (
            <Text className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-body text-xs text-orange-600 dark:border-orange-100/20 dark:bg-orange-600/10 dark:text-orange-600">
              À exporter
            </Text>
          )}
        </HStack>
      );
    },
    // Use Flashlist to access to extradata and remove this
    [patientMeasures],
  );
  return (
    <React.Fragment>
      <VStack className="pt-safe flex-1 bg-background-50 dark:bg-background-0">
        <VStack className=" h-18 w-full   items-center justify-center">
          <HStack className="w-full items-center gap-4 px-4 ">
            <Pressable
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="size-12 items-center justify-center rounded-full bg-background-0 dark:bg-background-50">
              <Icon as={X} className="" />
            </Pressable>
            <HStack className="h-12 flex-1 items-center justify-center rounded-3xl bg-background-0 px-4 dark:bg-background-50">
              <Text className="text-center font-h4 text-typography-950 " numberOfLines={1}>
                {id ? patients[id].name : 'patient not found'}
              </Text>
            </HStack>
            <Pressable
              disabled={patients[id].isLocked}
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="size-12 items-center justify-center rounded-full bg-green-600 hover:bg-green-700">
              <Icon as={Edit} className="text-white" />
            </Pressable>
          </HStack>
        </VStack>

        <VStack className="p-4">{patients[id] && <PatientHero patient={patients[id]} />}</VStack>
        <VStack className="mb-4 flex-1">
          <HStack className="items-center justify-between px-4">
            <Text className="font-h4 font-medium text-gray-700 dark:text-typography-800">
              Visites & Mesures
            </Text>

            {nonExportedCount > 0 && (
              <Text className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-body text-xs text-orange-600 dark:border-orange-100/20 dark:bg-orange-600/10 dark:text-orange-600">
                {nonExportedCount} non exportée{nonExportedCount > 1 ? 's' : ''}
              </Text>
            )}
          </HStack>
          <FlatList
            data={patientMeasures.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )}
            extraData={patientMeasures.length}
            renderItem={renderPatientMeasure}
            keyExtractor={(item) => item.id}
            contentContainerClassName="mt-5 mx-4 gap-4 "
            ListEmptyComponent={() => (
              <VStack className="rounded-xl border-gray-100 bg-background-0 p-8 text-center shadow-sm dark:bg-background-50">
                <Center className="gap-4">
                  <Box className="flex size-14 items-center justify-center rounded-full bg-background-100">
                    <Icon as={Calendar} className="size-7 text-gray-400" />
                  </Box>
                  <VStack className="">
                    <Text className="mb-1 text-center font-body text-gray-600 dark:text-typography-600">
                      Aucune visite enregistrée
                    </Text>
                    <Text className="text-center font-light text-sm text-gray-400 dark:text-typography-400">
                      Ajoutez une première visite pour ce patient
                    </Text>
                  </VStack>
                </Center>
              </VStack>
            )}
          />
        </VStack>

        <Fab
          placement="bottom center"
          className="bottom-8 size-14 bg-green-600 hover:bg-green-700"
          onPress={() => {
            router.navigate({
              pathname: '/[id]/add_measure_to_patient',
              params: { id },
            });
            Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
          }}>
          <FabIcon as={Plus} className="text-white" />
          <FabLabel className="absolute -bottom-4 font-light text-xs  font-semibold text-gray-700 dark:text-gray-400">
            Nouvelle visite
          </FabLabel>
        </Fab>
      </VStack>
    </React.Fragment>
  );
}

function PatientHero({ patient }: { patient: Patient }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };
  return (
    <HStack
      className={`elevation-sm  items-center justify-between rounded-xl bg-background-0 p-4 dark:bg-background-50`}>
      <HStack className="flex-1 items-center gap-3">
        <Avatar className="size-10 rounded-full bg-green-500">
          <AvatarFallbackText className="font-h3 text-base font-semibold text-white">
            {patient.name}
          </AvatarFallbackText>
          {patient.isLocked && (
            <AvatarBadge className=" size-4 items-center justify-center border-transparent bg-transparent">
              <Icon as={LockKeyhole} className="size-3" />
            </AvatarBadge>
          )}
        </Avatar>
        <VStack className="flex-1 pr-5">
          <Text className="font-h4 text-base font-medium text-typography-950" numberOfLines={1}>
            {patient.name}
          </Text>
          <VStack>
            <HStack className="items-center gap-2 ">
              <Icon as={Calendar} className="text-gray-600 dark:text-typography-600 " size="xs" />
              <Text
                className="truncate font-light text-xs font-normal text-gray-600 dark:text-typography-600"
                numberOfLines={1}>
                {HumanDateFormatter.formatAgeInMonths(patient.birthdate)} •{' '}
                {patient.sex === 'M' ? 'Masculin' : 'Féminin'}
              </Text>
            </HStack>
            <HStack className="items-center gap-2 ">
              <Icon as={User} className="text-gray-600 dark:text-typography-600 " size="xs" />
              <Text
                className="truncate font-light text-xs font-normal text-gray-600 dark:text-typography-600"
                numberOfLines={1}>
                {`Né${patient.sex === 'F' ? 'e' : ''}`} le {formatDate(patient.birthdate)}
              </Text>
            </HStack>
          </VStack>
          <VStack>
            {patient.contact?.tel && (
              <HStack className="items-center gap-2 ">
                <Icon as={Phone} className="text-gray-600 dark:text-typography-600 " size="xs" />
                <Text
                  className="truncate font-light text-xs font-normal text-gray-600 dark:text-typography-600"
                  numberOfLines={1}>
                  {patient.contact.tel}
                </Text>
              </HStack>
            )}
            {patient.contact?.email && (
              <HStack className="items-center gap-2 ">
                <Icon as={Mail} className="text-gray-600 dark:text-typography-600" size="xs" />
                <Text
                  className="truncate font-light text-xs font-normal text-gray-600 dark:text-typography-600"
                  numberOfLines={1}>
                  {patient.contact.email}
                </Text>
              </HStack>
            )}
          </VStack>
          {patient.address && (
            <HStack className="items-center gap-2 ">
              <Icon as={MapPin} className="text-gray-600 dark:text-typography-600 " size="xs" />
              <Text
                className="truncate font-light text-xs font-normal text-gray-600 dark:text-typography-600"
                numberOfLines={1}>
                {patient.address.fullAddress || patient.address.city}
              </Text>
            </HStack>
          )}
        </VStack>
      </HStack>
    </HStack>
  );
}
