import { BlurView } from '@/components/shared/BlurView';
import { EmptyState } from '@/components/shared/EmptyState';
import { SelectionChips } from '@/components/shared/SelectionChip';
import { Patient, Sex } from '@/schemas/patient.schema';
import { patients$ } from '@/store/patients/patients.store';
import { home$ } from '@/store/ui/home.store';
import { useValue } from '@legendapp/state/react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { BottomSheet, Label, PressableFeedback, Radio, RadioGroup } from 'heroui-native';
import { ChevronDown } from 'lucide-react-native';
import { useCallback } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT, SCROLL_THRESHOLD } from './Header';
import { PatientCard } from './PatientCard';

interface PatientListProps {
  onPatientPress: (id: string) => void;
  onPressEmptyStateBtn?: () => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollY: SharedValue<number>;
}

export function PatientList({
  onPatientPress,
  onPressEmptyStateBtn,
  onScroll,
  scrollY,
}: PatientListProps) {
  const showSearchBar = useValue(home$.showSearchBar);
  const isSearched = useValue(
    () => home$.searchQuery.get().trim() !== '' || home$.filters.sex.get() !== '',
  );
  const hasActiveFilters = useValue(() => home$.filters.sex.get().trim() !== '');
  const filters = useValue(home$.filters);
  const patients = useValue(() => {
    let list = Object.values(patients$.get());
    const searchQuery = home$.searchQuery.get();
    const filters = home$.filters.get();
    if (searchQuery.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filters.sex) {
      list = list.filter((p) => p.sex === filters.sex);
    }
    if (filters.sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return list;
  });

  const { top } = useSafeAreaInsets();
  const searchBarExtra = 70;

  const animatedSubheaderStyle = useAnimatedStyle(() => {
    const extra = showSearchBar ? searchBarExtra : 0;
    return {
      top: interpolate(
        scrollY.value,
        [0, SCROLL_THRESHOLD + extra],
        [HEADER_EXPANDED_HEIGHT + extra, top + 68],
        Extrapolation.CLAMP,
      ),
    };
  });

  const animatedListHeaderStyle = useAnimatedStyle(() => {
    const extra = showSearchBar ? searchBarExtra : 0;
    return {
      height: interpolate(
        scrollY.value,
        [0, SCROLL_THRESHOLD + extra],
        [HEADER_EXPANDED_HEIGHT + extra + 50, top + HEADER_COLLAPSED_HEIGHT + 50],
        Extrapolation.CLAMP,
      ),
    };
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Patient>) => (
      <PatientCard patient$={patients$[item.id]} onPress={onPatientPress} />
    ),
    [onPatientPress],
  );

  const resetFilters = () => home$.filters.set({ sex: '', sortBy: 'recent' });

  return (
    <View className="grow">
      <Animated.View
        className="absolute z-30 overflow-hidden flex-row items-center bg-background mx-2 rounded-3xl mt-v-1"
        style={animatedSubheaderStyle}>
        <BlurView />
        <View className="flex-1 px-6 flex-row items-center justify-between py-2">
          <Text className="text-muted font-medium text-2xs uppercase tracking-wider">
            {patients.length} patient{patients.length > 1 ? 's' : ''} au total
          </Text>

          <BottomSheet>
            <BottomSheet.Trigger asChild>
              <PressableFeedback
                accessibilityLabel="Options de filtrage et de tri"
                className="flex-row items-center gap-1.5 py-1 px-2 rounded-full active:bg-accent/5">
                <View
                  className={`h-1.5 w-1.5 rounded-full ${hasActiveFilters ? 'bg-accent shadow-sm shadow-accent/50' : 'bg-muted/30'}`}
                />
                <Text
                  className={`${hasActiveFilters ? 'text-accent' : 'text-muted'} font-bold text-2xs uppercase tracking-tighter`}>
                  {filters.sortBy === 'recent' ? 'Récent' : 'Nom'}
                  {filters.sex === Sex.MALE
                    ? ' • Garçons'
                    : filters.sex === Sex.FEMALE
                      ? ' • Filles'
                      : ''}
                </Text>
                <ChevronDown
                  size={10}
                  className={hasActiveFilters ? 'text-accent/60' : 'text-muted/40'}
                />
              </PressableFeedback>
            </BottomSheet.Trigger>
            <BottomSheet.Portal>
              <BottomSheet.Overlay>
                <BlurView />
              </BottomSheet.Overlay>
              <BottomSheet.Content
                contentContainerClassName="py-0"
                enableOverDrag={false}
                enableContentPanningGesture={false}>
                <View className="gap-6">
                  <View className="flex-row items-center justify-between border-b border-border py-v-2">
                    <Text className="text-foreground font-bold text-base">Options</Text>
                    {hasActiveFilters && (
                      <PressableFeedback onPress={resetFilters}>
                        <Text className="text-accent font-semibold text-xs tracking-tight">
                          Réinitialiser
                        </Text>
                      </PressableFeedback>
                    )}
                  </View>
                  <View className="gap-3">
                    <Text className="text-muted font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Trier par
                    </Text>
                    <RadioGroup
                      value={filters.sortBy}
                      onValueChange={(val) => home$.filters.sortBy.set(val as 'recent' | 'name')}
                      className="gap-2">
                      <RadioGroup.Item value="recent" className="flex-row items-center gap-3 p-1">
                        <Label className="text-sm font-medium">{"Date d'ajout"}</Label>
                        <Radio className="rounded-full border border-border">
                          <Radio.Indicator>
                            <Radio.IndicatorThumb />
                          </Radio.Indicator>
                        </Radio>
                      </RadioGroup.Item>
                      <RadioGroup.Item value="name" className="flex-row items-center gap-3 p-1">
                        <Label className="text-sm font-medium">Nom (A-Z)</Label>
                        <Radio className="rounded-full border border-border">
                          <Radio.Indicator>
                            <Radio.IndicatorThumb />
                          </Radio.Indicator>
                        </Radio>
                      </RadioGroup.Item>
                    </RadioGroup>
                  </View>
                  <View className="gap-3">
                    <Text className="text-muted font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Filtrer par Sexe
                    </Text>
                    <SelectionChips
                      data={[
                        { label: 'Tous', value: '' },
                        { label: 'Garçons', value: Sex.MALE },
                        { label: 'Filles', value: Sex.FEMALE },
                      ]}
                      value={filters.sex}
                      onChange={(val: string) => home$.filters.sex.set(val as Sex | '')}
                    />
                  </View>
                </View>
              </BottomSheet.Content>
            </BottomSheet.Portal>
          </BottomSheet>
        </View>
      </Animated.View>

      {/* <ScrollShadow
        LinearGradientComponent={LinearGradient}
        className="flex-1 z-10"
        size={40}
        isEnabled> */}
      <FlashList
        contentContainerClassName="px-2 py-v-3 h-full"
        data={patients}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-v-2" />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => <Animated.View style={animatedListHeaderStyle} />}
        ListFooterComponent={() => <View className="h-v-20 w-full" />}
        onScroll={onScroll as never}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View className="flex-1 justify-center px-2 h-full py-v-4">
            <EmptyState
              onPressIcon={!isSearched ? onPressEmptyStateBtn : undefined}
              iconName={isSearched ? 'SearchSlash' : 'UserPlus'}
              title={isSearched ? 'Aucun résultat' : 'Aucun patient enregistré'}
              description={
                isSearched
                  ? 'Aucun patient ne correspond à votre recherche.'
                  : 'Ajoutez un patient pour commencer.'
              }
            />
          </View>
        }
      />
      {/* </ScrollShadow> */}
    </View>
  );
}
