import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import { useToast } from '@/hooks/useToast';
import { useVisitActions } from '@/hooks/useVisitActions';
import { vibrate, vibrateError, vibrateSuccess } from '@/lib/utils/haptics';
import { logger } from '@/lib/utils/logger';
import { Visit } from '@/schemas/visit.schema';
// import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Accordion, Button } from 'heroui-native';
import { useCallback } from 'react';
import { LayoutAnimation, ScrollView, View } from 'react-native';
import { VisitCard } from './VisitCard';

interface VisitsTabProps {
  visits: Visit[];
  patientId: string;
  onNewVisit: () => void;
}

export function VisitsTab({ visits, patientId, onNewVisit }: VisitsTabProps) {
  const toast = useToast();
  const { deleteVisit } = useVisitActions();

  const sorted = [...visits].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleDelete = useCallback(
    (visitId: string) => {
      try {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        deleteVisit(patientId, visitId);
        vibrateSuccess();
        toast.show('Success', 'Visite supprimée');
      } catch (error) {
        vibrateError();
        logger.error('Failed to delete visit', error);
        toast.show('Error', 'Erreur lors de la suppression');
      }
    },
    [patientId, deleteVisit, toast],
  );

  // const renderItem = useCallback(
  //   ({ item, index }: ListRenderItemInfo<Visit>) => (
  //     <VisitCard
  //       visit={item}
  //       index={index}
  //       total={sorted.length}
  //       patientId={patientId}
  //       onDelete={() => handleDelete(item.id)}
  //     />
  //   ),
  //   [sorted.length, patientId, handleDelete],
  // );

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerClassName="px-2 pt-4 pb-v-18"
        showsVerticalScrollIndicator={false}>
        {sorted.length === 0 && (
          <View className="px-2 py-v-4">
            <EmptyState
              iconName="Activity"
              title="Aucune visite enregistrée"
              description="Appuyez sur le bouton ci-dessous pour démarrer la première collecte."
            />
          </View>
        )}
        {sorted.length !== 0 && (
          <Accordion variant="surface" selectionMode={'single'}>
            {/* <FlashList
          data={sorted}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-v-2" />}
          contentContainerClassName="px-4 pt-4 pb-v-18"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="px-2 py-v-4">
              <EmptyState
                iconName="Activity"
                title="Aucune visite enregistrée"
                description="Appuyez sur le bouton ci-dessous pour démarrer la première collecte."
              />
            </View>
          }
        /> */}

            {sorted.map((item, index) => (
              <VisitCard
                visit={item}
                key={item.id}
                index={index}
                total={sorted.length}
                patientId={patientId}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </Accordion>
        )}
      </ScrollView>
      <View className="absolute bottom-6 right-4">
        <Button
          className=" shadow-lg shadow-accent/20 gap-2"
          onPress={() => {
            vibrate('soft');
            onNewVisit();
          }}>
          <Icon name="Plus" sizeClassName="text-lg" className="text-white" />
          <Button.Label className="text-white font-semibold">Nouvelle visite</Button.Label>
        </Button>
      </View>
    </View>
  );
}
