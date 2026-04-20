import { Icon } from '@/components/shared/icons';
import { useToast } from '@/hooks/useToast';
import { vibrate } from '@/lib/utils/haptics';
import { resetAndReseedRegistry } from '@/store/registry/registry.seed';
import { Surface } from 'heroui-native';
import { Alert, Text } from 'react-native';
import { SettingRow } from './SettingRow';

interface DangerSectionProps {
  onLogoutPress: () => void;
}

export function DangerSection({ onLogoutPress }: DangerSectionProps) {
  const toast = useToast();

  const handleResetRegistry = () => {
    vibrate('heavy');
    Alert.alert(
      'Réinitialiser le registre ?',
      'Les données médicales de référence (médicaments, indicateurs, champs cliniques) seront effacées et remises à zéro. Vos patients ne seront pas affectés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            resetAndReseedRegistry();
            toast.show(
              'Success',
              'Registre réinitialisé',
              'Les références médicales ont été remises à zéro.',
            );
          },
        },
      ],
    );
  };

  return (
    <>
      <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">
        Zone de danger
      </Text>
      <Surface className="mb-6 overflow-hidden p-2 bg-red-500/5">
        <SettingRow
          iconName="DatabaseZap"
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-500"
          label="Réinitialiser le registre"
          description="Remet les références médicales à zéro"
          onPress={handleResetRegistry}
          rightElement={
            <Icon name="RotateCcw" className="text-red-500/60" sizeClassName="text-base" />
          }
        />
        <SettingRow
          iconName="LogOut"
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-500"
          label="Se déconnecter"
          description="Vos données restent sur l'appareil"
          isLast
          onPress={onLogoutPress}
          rightElement={
            <Icon name="ChevronRight" className="text-red-500/40" sizeClassName="text-base" />
          }
        />
      </Surface>
    </>
  );
}
