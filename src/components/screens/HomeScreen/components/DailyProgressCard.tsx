import { dailyStats$ } from '@/store/tasks/tasks.store';
import { useValue } from '@legendapp/state/react';
import { Surface } from 'heroui-native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function StatItem({
  value,
  label,
  valueClassName,
}: {
  value: number;
  label: string;
  valueClassName?: string;
}) {
  return (
    <View className="flex-1 gap-0.5">
      <Text className={`text-xl font-bold ${valueClassName ?? 'text-foreground'}`}>{value}</Text>
      <Text className="text-2xs font-bold uppercase  text-muted/70">{label}</Text>
    </View>
  );
}

export function DailyProgressCard() {
  const { total, done, remaining, pct } = useValue(dailyStats$);

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(pct, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [pct, progressWidth]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Surface className="rounded-2xl bg-surface border border-border/30 px-4 py-3 overflow-hidden">
      <View className="absolute top-0 left-0 right-0 h-px bg-accent/40" />
      <View className="flex-row items-start justify-between mb-3">
        <View className="gap-0.5">
          <Text className="text-2xs font-bold uppercase tracking-widest text-muted/60">
            Progression du jour
          </Text>
          <Text className="text-sm font-bold  text-foreground">Collecte de données</Text>
        </View>
        <View className="flex-row items-baseline gap-0.5">
          <Text className="text-2xl font-bold text-accent">{pct}</Text>
          <Text className="text-xs font-semibold text-muted/60">%</Text>
        </View>
      </View>

      <View className="flex-row mb-3">
        <StatItem value={done} label="Effectuées" valueClassName="text-accent" />
        <StatItem value={remaining} label="Restantes" valueClassName="text-amber-400" />
        <StatItem value={total} label="Total tâches" valueClassName="text-foreground/70" />
      </View>
      <View className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <Animated.View style={animatedBarStyle} className="h-full rounded-full bg-accent" />
      </View>
    </Surface>
  );
}
