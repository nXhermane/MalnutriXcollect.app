import { BlurView } from '@/components/shared/BlurView';
import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import { BottomSheet, Button, Chip, Spinner } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';

function formatFreshness(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  typeIcon: string;
  iconColorClass: string;
  iconBgClass: string;
  freshnessWindowInMinutes: number;
  isCheckingFreshness: boolean;
  freshDataFound: boolean;
  renderFreshDataSummary?: () => React.ReactNode;
  onAcceptFreshData?: () => void;
  acceptFreshDataLoading?: boolean;
  onRejectFreshData?: () => void;
  onComplete?: () => void;
  completeLoading?: boolean;
  completeError?: boolean;
  emptyState?: { isMissing: boolean; title: string; description: string };
  children: React.ReactNode;
}

export function DataRequirementModalLayout({
  isOpen,
  onClose,
  title,
  description,
  typeIcon,
  iconColorClass,
  iconBgClass,
  freshnessWindowInMinutes,
  isCheckingFreshness,
  freshDataFound,
  renderFreshDataSummary,
  onAcceptFreshData,
  acceptFreshDataLoading = false,
  onRejectFreshData,
  children,
  emptyState,
  onComplete,
  completeLoading = false,
  completeError = false,
}: Props) {
  const showForm = !isCheckingFreshness && !freshDataFound;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <BottomSheet.Content
          snapPoints={['80%']}
          enableDynamicSizing={false}
          enableOverDrag={false}
          contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
          <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border">
            <View
              className={`h-10 w-10 items-center justify-center rounded-full shrink-0 ${iconBgClass}`}>
              <Icon name={typeIcon as never} sizeClassName="text-sm" className={iconColorClass} />
            </View>
            <View className="flex-1 gap-1">
              <BottomSheet.Title
                className="font-semibold text-base text-foreground"
                numberOfLines={1}>
                {title}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-muted text-xs font-normal">
                {description}
              </BottomSheet.Description>
            </View>
            <BottomSheet.Close />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4 gap-3 px-3 pt-3">
            <View className="flex-row items-center justify-between rounded-xl px-3 py-2.5 border border-accent/20 bg-accent/5">
              <View className="flex-row items-center gap-2">
                <Icon name="Clock" sizeClassName="text-sm" className="text-accent" />
                <Text className="text-sm font-medium text-foreground">Délai de fraîcheur</Text>
              </View>
              <Chip size="sm" variant="soft" color="accent">
                <Chip.Label>{formatFreshness(freshnessWindowInMinutes)}</Chip.Label>
              </Chip>
            </View>

            {isCheckingFreshness ? (
              <View className="py-10 items-center justify-center gap-4">
                <Spinner size="lg" color="default" />
                <Text className="text-sm text-muted">Recherche de données récentes...</Text>
              </View>
            ) : freshDataFound && renderFreshDataSummary ? (
              <View className="gap-4 pt-2">
                <View className="p-4 bg-success/10 border border-success/20 rounded-xl gap-3">
                  <View className="flex-row items-center gap-2">
                    <Icon name="CircleCheck" sizeClassName="text-sm" className="text-success" />
                    <Text className="text-sm font-semibold text-foreground">
                      Données récentes trouvées
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    Des données valides ont été collectées récemment et correspondent aux critères.
                  </Text>
                  {renderFreshDataSummary()}
                </View>
                <View className="gap-2">
                  <Button
                    variant="primary"
                    isDisabled={acceptFreshDataLoading}
                    onPress={onAcceptFreshData}
                    className="w-full">
                    {acceptFreshDataLoading ? (
                      <Spinner className="text-white" />
                    ) : (
                      <Button.Label className="font-normal text-sm">
                        Utiliser ces données
                      </Button.Label>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    isDisabled={acceptFreshDataLoading}
                    onPress={onRejectFreshData}
                    className="w-full">
                    <Button.Label className="font-normal text-sm text-danger">
                      Ignorer et saisir manuellement
                    </Button.Label>
                  </Button>
                </View>
              </View>
            ) : showForm ? (
              emptyState?.isMissing ? (
                <EmptyState
                  iconName="Circle"
                  title={emptyState.title}
                  description={emptyState.description}
                />
              ) : (
                children
              )
            ) : null}
          </ScrollView>

          {showForm && !emptyState?.isMissing && onComplete && (
            <View className="w-full px-3 pt-3 border-t border-border">
              <Button
                variant={completeError ? 'danger' : 'primary'}
                isDisabled={completeLoading}
                className="w-full h-12"
                onPress={onComplete}>
                {completeLoading ? (
                  <Spinner className="text-white" />
                ) : completeError ? (
                  <Icon name="CircleAlert" className="text-white" sizeClassName="text-base" />
                ) : (
                  <Button.Label className="font-normal text-sm">Enregistrer</Button.Label>
                )}
              </Button>
            </View>
          )}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
