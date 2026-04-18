import { SettingRow } from '@/components/screens/SettingsScreen/components/SettingRow';
import { vibrate } from '@/lib/utils/haptics';
import { settings$ } from '@/store/settings/settings.store';
import { useValue } from '@legendapp/state/react';
import { Surface } from 'heroui-native';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

interface TimeInputProps {
  value: string;
  onCommit: (value: string) => void;
}

const TimeInput = ({ value, onCommit }: TimeInputProps) => {
  const [draft, setDraft] = useState(value);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleBlur = () => {
    if (isValidTime(draft)) {
      setIsInvalid(false);
      onCommit(draft);
      vibrate('soft');
    } else {
      setIsInvalid(true);
      setDraft(value); // revert
    }
  };

  return (
    <View
      className={`bg-default/10 px-3 py-1.5 rounded-lg border ${isInvalid ? 'border-danger' : 'border-transparent'}`}>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onBlur={handleBlur}
        keyboardType="numbers-and-punctuation"
        maxLength={5}
        className="font-bold text-foreground text-sm w-14 text-center"
        accessibilityLabel="Heure au format HH:MM"
      />
    </View>
  );
};

export const PersonalizationSection = () => {
  const settings = useValue(settings$);

  return (
    <>
      <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">
        Personnalisation
      </Text>
      <Surface className="rounded-3xl mb-6 overflow-hidden">
        <SettingRow
          iconName="Clock"
          iconBgClass="bg-default/10"
          iconColorClass="text-foreground"
          label="Heure de début"
          description="Début de votre plage de travail"
          rightElement={
            <TimeInput
              value={settings.personalization.workHours.start}
              onCommit={(v) => settings$.personalization.workHours.start.set(v)}
            />
          }
        />
        <SettingRow
          iconName="Clock"
          iconBgClass="bg-default/10"
          iconColorClass="text-foreground"
          label="Heure de fin"
          description="Fin de votre plage de travail"
          isLast
          rightElement={
            <TimeInput
              value={settings.personalization.workHours.end}
              onCommit={(v) => settings$.personalization.workHours.end.set(v)}
            />
          }
        />
      </Surface>
    </>
  );
};
