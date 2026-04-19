import { BlurView } from '@/components/shared/BlurView';
import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import { SelectionChips } from '@/components/shared/SelectionChip';
import {
  HEADER_COLLAPSED_HEIGHT,
  HEADER_EXPANDED_HEIGHT,
  SCROLL_THRESHOLD,
} from '@/constants/home';
import { STATUS_CONFIG } from '@/constants/patient';
import { Patient, PatientStatus, Sex } from '@/schemas/patient.schema';
import { patients$ } from '@/store/patients/patients.store';
import { home$ } from '@/store/ui/home.store';
import { useValue } from '@legendapp/state/react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BottomSheet,
  cn,
  PressableFeedback,
  Radio,
  RadioGroup,
  ScrollShadow,
  SearchField,
  useThemeColor,
} from 'heroui-native';
import { useCallback, useEffect } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const showSearchBar = useValue(() => home$.showSearchBar.get());
  const searchQuery = useValue(() => home$.searchQuery.get());
  const isSearched = useValue(
    () =>
      home$.searchQuery.get().trim() !== '' ||
      home$.filters.sex.get() !== '' ||
      home$.filters.status.get() !== '',
  );
  const hasActiveFilters = useValue(
    () => home$.filters.sex.get().trim() !== '' || home$.filters.status.get().trim() !== '',
  );
  const filters = useValue(home$.filters);
  const patients = useValue(() => {
    let list = Object.values(patients$.get());
    const q = home$.searchQuery.get();
    const f = home$.filters.get();
    if (q.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    }
    if (f.sex) {
      list = list.filter((p) => p.sex === f.sex);
    }
    if (f.status) {
      list = list.filter((p) => (p.status ?? PatientStatus.NEW) === f.status);
    }
    if (f.sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return list;
  });
  const [surfaceColor, bgColor] = useThemeColor(['surface', 'background']);

  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (!showSearchBar) {
      home$.searchQuery.set('');
    }
  }, [showSearchBar]);

  const animatedSubheaderStyle = useAnimatedStyle(() => ({
    top: interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [HEADER_EXPANDED_HEIGHT, top + 68],
      Extrapolation.CLAMP,
    ),
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [bgColor, surfaceColor],
    ),
  }));

  const animatedListHeaderStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [HEADER_EXPANDED_HEIGHT + 50, top + HEADER_COLLAPSED_HEIGHT + 50],
      Extrapolation.CLAMP,
    ),
  }));

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Patient>) => (
      <PatientCard patient$={patients$[item.id]} onPress={onPatientPress} />
    ),
    [onPatientPress],
  );

  const resetFilters = () => home$.filters.set({ sex: '', status: '', sortBy: 'recent' });

  return (
    <View className="grow">
      <Animated.View
        className="absolute z-30 overflow-hidden left-0 right-0 mx-2 rounded-3xl mt-v-2"
        style={animatedSubheaderStyle}>
        {showSearchBar ? (
          <Animated.View
            entering={FadeInDown.duration(280).springify().damping(18)}
            exiting={FadeOutUp.duration(200)}
            className="w-full px-0 py-0">
            <SearchField
              value={searchQuery}
              onChange={(text: string) => home$.searchQuery.set(text)}>
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Chercher un patient par nom..." autoFocus />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInUp.duration(280).springify().damping(18)}
            exiting={FadeOutDown.duration(200)}
            className="flex-row items-center justify-between px-4 py-2">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-muted font-bold text-2xs uppercase tracking-widest">
                {patients.length} patient{patients.length > 1 ? 's' : ''}
              </Text>
              <Text className="text-muted/30 text-xs">·</Text>
              <Text className="text-muted/60 font-medium text-2xs">Mes patients</Text>
            </View>

            <BottomSheet>
              <BottomSheet.Trigger asChild>
                <PressableFeedback
                  accessibilityLabel="Options de filtrage et de tri"
                  className={`flex-row items-center gap-1.5 py-1.5 px-3 rounded-full border ${
                    hasActiveFilters
                      ? 'border-accent/40 bg-accent/8'
                      : 'border-border/40 bg-surface/60'
                  }`}>
                  <Icon
                    name="SlidersHorizontal"
                    size={10}
                    className={hasActiveFilters ? 'text-accent' : 'text-muted/60'}
                  />
                  <Text
                    className={`font-bold text-2xs ${hasActiveFilters ? 'text-accent' : 'text-muted/70'}`}>
                    {filters.sortBy === 'recent' ? 'Récent' : 'Nom'}
                    {filters.sex === Sex.MALE
                      ? ' · Garçons'
                      : filters.sex === Sex.FEMALE
                        ? ' · Filles'
                        : ''}
                    {filters.status ? ` · ${STATUS_CONFIG[filters.status].label}` : ''}
                  </Text>
                  <Icon
                    name="ChevronDown"
                    size={9}
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
                          <Text className="text-sm text-foreground font-normal">
                            {"Date d'ajout"}
                          </Text>
                          <Radio className="rounded-full border border-border">
                            <Radio.Indicator>
                              <Radio.IndicatorThumb />
                            </Radio.Indicator>
                          </Radio>
                        </RadioGroup.Item>
                        <RadioGroup.Item value="name" className="flex-row items-center gap-3 p-1">
                          <Text className="text-sm text-foreground font-normal">Nom (A-Z)</Text>
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
                    <View className="gap-3">
                      <Text className="text-muted font-bold text-[10px] uppercase tracking-widest opacity-60">
                        Filtrer par Statut
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {(['', ...Object.values(PatientStatus)] as (PatientStatus | '')[]).map(
                          (s) => {
                            const isAll = s === '';
                            const active = filters.status === s;
                            const cfg = isAll ? null : STATUS_CONFIG[s as PatientStatus];
                            return (
                              <PressableFeedback
                                key={s === '' ? '__all__' : s}
                                onPress={() => home$.filters.status.set(s as PatientStatus | '')}
                                className={cn(
                                  'px-3 py-1.5 rounded-full border',
                                  active && !isAll
                                    ? cn(cfg!.pillBg, cfg!.pillBorder)
                                    : active && isAll
                                      ? 'bg-accent/15 border-accent/30'
                                      : 'bg-white/5 border-white/10',
                                )}>
                                <Text
                                  className={cn(
                                    'text-xs font-bold',
                                    active && !isAll
                                      ? cfg!.pillText
                                      : active && isAll
                                        ? 'text-accent'
                                        : 'text-muted/60',
                                  )}>
                                  {isAll ? 'Tous' : STATUS_CONFIG[s].label}
                                </Text>
                              </PressableFeedback>
                            );
                          },
                        )}
                      </View>
                    </View>
                  </View>
                </BottomSheet.Content>
              </BottomSheet.Portal>
            </BottomSheet>
          </Animated.View>
        )}
      </Animated.View>

      <ScrollShadow
        LinearGradientComponent={LinearGradient}
        className="flex-1 z-10"
        size={40}
        isEnabled>
        <FlashList
          contentContainerClassName="px-2 py-v-3 grow"
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
      </ScrollShadow>
    </View>
  );
}
