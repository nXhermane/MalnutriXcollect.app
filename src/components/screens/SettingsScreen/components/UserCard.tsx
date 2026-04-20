import { Icon } from '@/components/shared/icons';
import { PROFESSION_OPTIONS, userProfile$ } from '@/store/user/user.store';
import { useValue } from '@legendapp/state/react';
import { Avatar, Surface } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';

interface UserCardProps {
  onEditPress: () => void;
}

function deriveInitials(displayName: string): string {
  return displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

export const UserCard = ({ onEditPress }: UserCardProps) => {
  const profile = useValue(userProfile$);

  if (!profile) {
    return (
      <Surface className="p-4 rounded-3xl mb-6">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 rounded-2xl bg-surface-secondary animate-pulse" />
          <View className="flex-1 gap-2">
            <View className="h-4 w-36 rounded-xl bg-surface-secondary animate-pulse" />
            <View className="h-3 w-24 rounded-xl bg-surface-secondary animate-pulse" />
            <View className="h-3 w-44 rounded-xl bg-surface-secondary animate-pulse" />
          </View>
        </View>
      </Surface>
    );
  }

  const initials = deriveInitials(profile.display_name || 'U');
  const professionLabel =
    PROFESSION_OPTIONS.find((p) => p.value === profile.profession)?.label ?? profile.profession;

  const locationParts = [profile.department_id, profile.facility_id].filter(Boolean);
  const hasLocation = locationParts.length > 0;

  return (
    <Surface className="p-4 rounded-3xl mb-6">
      <View className="flex-row items-center gap-4">
        <View className="relative">
          <Avatar
            className="h-16 w-16 rounded-2xl border-2 border-accent/20"
            alt={profile.display_name ?? 'User'}>
            {profile.avatar_url ? <Avatar.Image source={{ uri: profile.avatar_url }} /> : null}
            <Avatar.Fallback className="bg-accent/10 rounded-2xl">
              <Text className="text-accent font-bold text-xl">{initials}</Text>
            </Avatar.Fallback>
          </Avatar>
          <Pressable
            onPress={onEditPress}
            className="absolute -bottom-1.5 -right-1.5 bg-accent rounded-full p-1.5 border-2 border-surface shadow-md active:opacity-80"
            accessibilityLabel="Modifier le profil">
            <Icon name="Pencil" size={11} className="text-white" />
          </Pressable>
        </View>

        <View className="flex-1 gap-0.5">
          <Text className="text-base font-bold text-foreground leading-tight" numberOfLines={1}>
            {profile.display_name ?? 'Utilisateur'}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-0.5">
            <View className="bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
              <Text className="text-xs font-bold text-accent uppercase tracking-wide">
                {professionLabel}
              </Text>
            </View>
          </View>
          {profile.phone ? (
            <View className="flex-row items-center gap-1 mt-1">
              <Icon name="Phone" size={10} className="text-muted/50" />
              <Text className="text-xs text-muted/60">{profile.phone}</Text>
            </View>
          ) : null}
          {hasLocation ? (
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name="MapPin" size={10} className="text-muted/50" />
              <Text className="text-xs text-muted/60" numberOfLines={1}>
                Localisation enregistrée
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={onEditPress}
              className="flex-row items-center gap-1 mt-0.5 active:opacity-70">
              <Icon name="MapPin" size={10} className="text-warning/70" />
              <Text className="text-xs text-warning/70">Ajouter une localisation</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={onEditPress}
          className="p-2 rounded-xl bg-surface-secondary/60 active:bg-surface-secondary"
          accessibilityLabel="Modifier le profil">
          <Icon name="ChevronRight" size={16} className="text-muted/50" />
        </Pressable>
      </View>
    </Surface>
  );
};
