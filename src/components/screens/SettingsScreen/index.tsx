import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { APP_VERSION, IS_BETA, MALNUTRIX_WEBSITE_URL } from '@/constants/app';
import { useLogout } from '@/hooks/useLogout';
import { useToast } from '@/hooks/useToast';
import { vibrate } from '@/lib/utils/haptics';
import { useRouter } from 'expo-router';
import { Surface } from 'heroui-native';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppSettingsSection } from './components/AppSettingsSection';
import { EditProfileSheet } from './components/EditProfileSheet';
import { LogoutSheet } from './components/LogoutSheet';
import { PersonalizationSection } from './components/PersonalizationSection';
import { SettingRow } from './components/SettingRow';
import { UserCard } from './components/UserCard';
import { resetAndReseedRegistry } from '@/store/registry/registry.seed';

export function SettingsScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isSheetOpen, openLogoutSheet, closeLogoutSheet, isLoggingOut, confirmLogout } =
    useLogout();

  const [base, betaSuffix] = APP_VERSION.split('-beta.');

  const handleResetRegistry = () => {
    vibrate('heavy');
    Alert.alert(
      'Réinitialiser le registre ?',
      'Toutes les références médicales synchronisées (médicaments, indicateurs, champs...) seront supprimées et remplacées par les données intégrées par défaut. Cette action est irréversible.',
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
              'Les données ont été effacées et le seed par défaut a été appliqué.',
            );
          },
        },
      ],
    );
  };

  const VersionBadge = () => (
    <View className="flex-row items-center gap-2">
      <Text className="text-sm font-medium text-foreground">v{base}</Text>
      {IS_BETA && (
        <View className="bg-warning/15 border border-warning/30 rounded-full px-2 py-0.5">
          <Text className="text-xs font-semibold text-warning tracking-wide">
            BETA{betaSuffix ? ` .${betaSuffix}` : ''}
          </Text>
        </View>
      )}
    </View>
  );

  const handleOpenWebsite = async () => {
    try {
      await Linking.openURL(MALNUTRIX_WEBSITE_URL);
    } catch {
      toast.show('Error', 'Lien indisponible', "Impossible d'ouvrir le site Malnutrix.");
    }
  };

  return (
    <View className="flex-1 bg-background pt-safe-offset-0">
      <View className="absolute z-30 w-full overflow-hidden" style={{ top }}>
        <BlurView />
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            className="bg-surface/80 p-3 rounded-2xl shadow-sm active:bg-surface"
            accessibilityLabel="Retour"
            onPress={() => {
              vibrate('soft');
              router.back();
            }}>
            <Icon name="ArrowLeft" sizeClassName="text-lg" className="text-foreground" />
          </Pressable>
          <View className="flex-1 bg-surface/80 h-12 rounded-2xl shadow-sm items-center justify-center">
            <Text className="text-foreground text-base font-bold tracking-tight">Paramètres</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-2 pb-v-4 pt-v-18"
        showsVerticalScrollIndicator={false}>
        <UserCard onEditPress={() => setIsEditOpen(true)} />

        <AppSettingsSection />

        <PersonalizationSection />

        <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">
          À propos
        </Text>
        <Surface className="rounded-3xl mb-6 overflow-hidden">
          <SettingRow
            iconName="Globe"
            iconBgClass="bg-accent/10"
            iconColorClass="text-accent"
            label="Site officiel Malnutrix"
            description="Visiter notre plateforme web"
            onPress={handleOpenWebsite}
            rightElement={<Icon name="ExternalLink" className="text-muted/50 h-5 w-5" />}
          />
          <SettingRow
            iconName="Info"
            iconBgClass="bg-surface-secondary/50"
            iconColorClass="text-muted"
            label="Version"
            isLast
            rightElement={<VersionBadge />}
          />
        </Surface>

        <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">
          Zone de danger
        </Text>
        <Surface className="rounded-3xl mb-4 overflow-hidden bg-red-500/5">
          <SettingRow
            iconName="DatabaseZap"
            iconBgClass="bg-red-500/10"
            iconColorClass="text-red-500"
            label="Réinitialiser le registre"
            description="Efface le cache et relance le seed par défaut"
            onPress={handleResetRegistry}
            rightElement={
              <Icon name="RotateCcw" className="text-red-500/60" sizeClassName="text-base" />
            }
          />
        </Surface>

        <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">
          Compte
        </Text>
        <Surface className="rounded-3xl overflow-hidden bg-red-500/5">
          <SettingRow
            iconName="LogOut"
            iconBgClass="bg-red-500/10"
            iconColorClass="text-red-500"
            label="Se déconnecter"
            description="Quitter votre session locale"
            isLast
            onPress={() => {
              vibrate('heavy');
              openLogoutSheet();
            }}
          />
        </Surface>
      </ScrollView>

      <EditProfileSheet isOpen={isEditOpen} onOpenChange={setIsEditOpen} />
      <LogoutSheet
        isOpen={isSheetOpen}
        onOpenChange={(open) => (open ? openLogoutSheet() : closeLogoutSheet())}
        isLoggingOut={isLoggingOut}
        onConfirm={confirmLogout}
      />
    </View>
  );
}
