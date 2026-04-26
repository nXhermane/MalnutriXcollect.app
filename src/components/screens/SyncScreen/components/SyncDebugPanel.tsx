import { Icon } from '@/components/shared/icons';
import type { SyncDebugEntry } from '@/store/sync/sync-debug.store';
import { clearSyncDebugLog, sync_debug$ } from '@/store/sync/sync-debug.store';
import { useValue } from '@legendapp/state/react';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

function DebugEntryRow({ entry }: { entry: SyncDebugEntry }) {
  const [expanded, setExpanded] = useState(false);
  const isReceived = entry.direction === 'received';
  const time = new Date(entry.timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const json = JSON.stringify(entry.content, null, 2);

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      className="border-b border-zinc-800/60 py-2 px-3 gap-1 active:bg-zinc-800/30">
      <View className="flex-row items-center gap-2">
        <Icon
          name={isReceived ? 'ArrowDownLeft' : 'ArrowUpRight'}
          sizeClassName="text-xs"
          className={isReceived ? 'text-sky-400' : 'text-emerald-400'}
        />
        <Text
          className={`text-xs font-bold flex-1 ${isReceived ? 'text-sky-400' : 'text-emerald-400'}`}
          numberOfLines={1}>
          {entry.type}
        </Text>
        <Text className="text-[10px] text-zinc-600 font-mono mr-1">{time}</Text>
        <Icon
          name={expanded ? 'ChevronUp' : 'ChevronDown'}
          sizeClassName="text-xs"
          className="text-zinc-600"
        />
      </View>
      <Text
        className="text-[10px] text-zinc-500 font-mono leading-relaxed"
        numberOfLines={expanded ? undefined : 2}>
        {json}
      </Text>
    </Pressable>
  );
}

export function SyncDebugPanel() {
  const entries = useValue(() => sync_debug$.entries.get());
  const isVisible = useValue(() => sync_debug$.isVisible.get());
  const scrollRef = useRef<ScrollView>(null);

  if (!isVisible) {
    return (
      <Pressable
        onPress={() => sync_debug$.isVisible.set(true)}
        className="absolute bottom-20 right-4 z-50 bg-zinc-900/90 border border-zinc-700 rounded-xl px-3 py-2 flex-row items-center gap-2 active:opacity-70">
        <Icon name="Bug" sizeClassName="text-sm" className="text-amber-400" />
        <Text className="text-amber-400 text-xs font-bold">Debug</Text>
        {entries.length > 0 && (
          <View className="bg-amber-400 rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-zinc-900 text-[9px] font-black">{entries.length}</Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View className="absolute inset-x-0 bottom-0 z-50 h-2/3 bg-zinc-950/97 border-t border-zinc-700 rounded-t-2xl">
      <View className="flex-row items-center px-4 py-3 border-b border-zinc-800 gap-3">
        <Icon name="Bug" sizeClassName="text-sm" className="text-amber-400" />
        <Text className="text-amber-400 text-sm font-bold flex-1">
          Sync Debug — {entries.length} message{entries.length !== 1 ? 's' : ''}
        </Text>
        <Pressable
          onPress={clearSyncDebugLog}
          className="px-2 py-1 rounded-lg bg-zinc-800 active:opacity-60">
          <Text className="text-zinc-400 text-xs">Vider</Text>
        </Pressable>
        <Pressable
          onPress={() => sync_debug$.isVisible.set(false)}
          className="p-1 rounded-lg bg-zinc-800 active:opacity-60">
          <Icon name="X" sizeClassName="text-sm" className="text-zinc-400" />
        </Pressable>
      </View>

      <View className="flex-row gap-4 px-4 py-2 border-b border-zinc-800/60">
        <View className="flex-row items-center gap-1.5">
          <Icon name="ArrowDownLeft" sizeClassName="text-xs" className="text-sky-400" />
          <Text className="text-sky-400 text-[10px] font-semibold">Reçu de Pro</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon name="ArrowUpRight" sizeClassName="text-xs" className="text-emerald-400" />
          <Text className="text-emerald-400 text-[10px] font-semibold">Envoyé à Pro</Text>
        </View>
        <Text className="text-zinc-600 text-[10px] ml-auto">Tap pour expand</Text>
      </View>

      {entries.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Icon name="Inbox" sizeClassName="text-2xl" className="text-zinc-600" />
          <Text className="text-zinc-600 text-xs">Aucun message échangé</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {[...entries].reverse().map((entry) => (
            <DebugEntryRow key={entry.id} entry={entry} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
