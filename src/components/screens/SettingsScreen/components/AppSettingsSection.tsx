import { SettingRow } from '@/components/screens/SettingsScreen/components/SettingRow';
import { vibrate } from '@/lib/utils/haptics';
import { settings$ } from '@/store/settings/settings.store';
import { theme$ } from '@/store/ui/theme.store';
import { useValue } from '@legendapp/state/react';
import { Surface, Switch } from 'heroui-native';
import { Appearance, Text } from 'react-native';

export const AppSettingsSection = () => {
  const settings = useValue(settings$);
  const themeMode = useValue(theme$.mode);

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    theme$.mode.set(next);
    theme$.isSystem.set(false);
    Appearance.setColorScheme(next);
    vibrate('soft');
  };

  return (
    <>
      <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">
        Application
      </Text>
      <Surface className="mb-6 overflow-hidden p-2">
        <SettingRow
          iconName={themeMode === 'dark' ? 'Moon' : 'Sun'}
          iconBgClass={themeMode === 'dark' ? 'bg-violet-500/10' : 'bg-amber-400/10'}
          iconColorClass={themeMode === 'dark' ? 'text-violet-400' : 'text-amber-400'}
          label="Thème"
          description={themeMode === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}
          rightElement={<Switch isSelected={themeMode === 'dark'} onSelectedChange={toggleTheme} />}
        />
        <SettingRow
          iconName="Vibrate"
          iconBgClass="bg-accent/10"
          iconColorClass="text-accent"
          label="Retours Haptiques"
          description="Vibrations au toucher"
          isLast
          rightElement={
            <Switch
              isSelected={settings.haptics.enabled}
              onSelectedChange={(v) => {
                settings$.haptics.enabled.set(v);
                if (v) vibrate('soft');
              }}
            />
          }
        />
      </Surface>
    </>
  );
};
