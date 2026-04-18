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
          iconBgClass="bg-accent/10"
          iconColorClass="text-accent"
          label="Mode Sombre"
          description={`Basculer le thème de l'application`}
          rightElement={<Switch isSelected={themeMode === 'dark'} onSelectedChange={toggleTheme} />}
        />
        <SettingRow
          iconName="Vibrate"
          iconBgClass="bg-accent/10"
          iconColorClass="text-accent"
          label="Retours Haptiques"
          description="Activer les vibrations au toucher"
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
        {/* <SettingRow
          iconName="Eye"
          iconBgClass="bg-default/10"
          iconColorClass="text-foreground"
          label="Effets visuels (Flou)"
          description="Activer les superpositions translucides"
          isLast
          rightElement={
            <Switch
              isSelected={settings.ui.blurEnabled}
              onSelectedChange={(v) => {
                settings$.ui.blurEnabled.set(v);
                vibrate('soft');
              }}
            />
          }
        /> */}
      </Surface>
    </>
  );
};
