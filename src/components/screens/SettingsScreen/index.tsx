import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { APP_VERSION, IS_BETA, MALNUTRIX_WEBSITE_URL } from '@/constants/app';
import { useLogout } from '@/hooks/useLogout';
import { useToast } from '@/hooks/useToast';
import { vibrate } from '@/lib/utils/haptics';
import { useRouter } from 'expo-router';
import { Surface } from 'heroui-native';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppSettingsSection } from './components/AppSettingsSection';
import { DangerSection } from './components/DangerSection';
import { EditProfileSheet } from './components/EditProfileSheet';
import { LogoutSheet } from './components/LogoutSheet';
import { PersonalizationSection } from './components/PersonalizationSection';
import { SettingRow } from './components/SettingRow';
import { UserCard } from './components/UserCard';

export function SettingsScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isSheetOpen, openLogoutSheet, closeLogoutSheet, isLoggingOut, confirmLogout } =
    useLogout();

  const [base, betaSuffix] = APP_VERSION.split('-beta.');

  const VersionBadge = () => (
    <View className="bg-surface-secondary/60 border border-border/40 rounded-xl px-3 py-1.5 flex-row items-center gap-2">
      <Text className="text-xs font-bold text-foreground/80 tracking-tight">v{base}</Text>
      {IS_BETA && (
        <>
          <View className="w-px h-3 bg-border/60" />
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-warning" />
            <Text className="text-xs font-extrabold text-warning tracking-widest uppercase">
              Beta{betaSuffix ? ` ${betaSuffix}` : ''}
            </Text>
          </View>
        </>
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

  const handleLogoutPress = () => {
    vibrate('heavy');
    openLogoutSheet();
  };

  return (
    <View className="flex-1 bg-background pt-safe-offset-0">
      <View className="absolute z-30 w-full overflow-hidden" style={{ top }}>
        <BlurView />
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            className="bg-surface/80 p-2.5 rounded-2xl shadow-sm active:bg-surface"
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
        <Surface className="mb-6 overflow-hidden p-2">
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
            description="MalnutriX Collect"
            isLast
            rightElement={<VersionBadge />}
          />
        </Surface>

        <DangerSection onLogoutPress={handleLogoutPress} />
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
