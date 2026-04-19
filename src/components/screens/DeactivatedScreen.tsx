import { BlurView } from '@/components/shared/BlurView';
import { MeshGradientBackground } from '@/components/shared/MeshGradientBackground';
import { useLogout } from '@/hooks/useLogout';
import { Button, Spinner } from 'heroui-native';
import { useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import { Icon } from '../shared/icons';
import { CopyrightNotice } from '../shared/CopyrightNotice';

const CONTACT_URL = process.env.EXPO_PUBLIC_CONTACT_URL ?? 'https://malnutrix.app/contact';

export function DeactivatedScreen() {
  const { confirmLogout, isLoggingOut } = useLogout();

  const openContact = useCallback(() => {
    Linking.openURL(CONTACT_URL);
  }, []);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <MeshGradientBackground />

      <View className="flex-[0.6] items-center justify-center gap-y-4 px-8">
        <View className="items-center justify-center rounded-full bg-surface/80 p-6">
          <Icon name={'UserX'} size={56} className="text-danger" />
        </View>
        <Text className="text-center text-3xl font-bold text-foreground">Compte désactivé</Text>
        <Text className="text-center text-base leading-relaxed text-muted">
          Votre accès à MalnutriX Collect a été suspendu. Veuillez contacter votre administrateur
          pour rétablir votre compte.
        </Text>
      </View>

      <View className="flex-[0.4] justify-end px-4 pb-10">
        <View className="overflow-hidden rounded-[40px] border border-border/50 shadow-2xl">
          <BlurView />
          <View className="gap-y-3 px-4 py-8">
            <Button onPress={openContact} className="h-14 rounded-2xl bg-primary shadow-sm">
              <Icon name={'ExternalLink'} size={18} className="text-primary-foreground" />
              <Button.Label className="ml-2 font-semibold text-primary-foreground">
                {"Contacter l'administrateur"}
              </Button.Label>
            </Button>

            <Button
              onPress={confirmLogout}
              isDisabled={isLoggingOut}
              className="h-14 rounded-2xl border border-border/20 bg-surface shadow-sm">
              {isLoggingOut ? (
                <Spinner />
              ) : (
                <Button.Label className="font-semibold text-foreground">
                  Se déconnecter
                </Button.Label>
              )}
            </Button>
          </View>
        </View>

        <CopyrightNotice />
      </View>
    </View>
  );
}
