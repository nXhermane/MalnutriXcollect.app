import { Icon } from '@/components/shared/icons';
import { BottomSheet, Button } from 'heroui-native';
import { View } from 'react-native';

interface LogoutSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isLoggingOut: boolean;
  onConfirm: () => Promise<void>;
}

export const LogoutSheet = ({
  isOpen,
  onOpenChange,
  isLoggingOut,
  onConfirm,
}: LogoutSheetProps) => {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onOpenChange(false)}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="items-center mb-5">
            <View className="size-16 items-center justify-center rounded-full bg-red-500/10 mb-3">
              <Icon name="LogOut" className="text-red-500 h-8 w-8" />
            </View>
            <BottomSheet.Title className="text-center text-xl font-bold">
              Se déconnecter
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center text-sm text-muted mt-1 px-6">
              Votre session sera fermée. Toutes vos données restent sur l&apos;appareil — vous
              pourrez vous reconnecter sans rien perdre.
            </BottomSheet.Description>
          </View>

          <View className="gap-3">
            <Button variant="danger" onPress={onConfirm} isDisabled={isLoggingOut}>
              <Button.Label>
                {isLoggingOut ? 'Déconnexion en cours...' : 'Confirmer la déconnexion'}
              </Button.Label>
            </Button>

            <Button
              variant="tertiary"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoggingOut}>
              <Button.Label>Annuler</Button.Label>
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
