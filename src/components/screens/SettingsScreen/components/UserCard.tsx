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
        <View className="items-center gap-3">
          <View className="h-24 w-24 rounded-full bg-surface-secondary animate-pulse" />
          <View className="h-5 w-40 rounded-xl bg-surface-secondary animate-pulse" />
          <View className="h-3 w-48 rounded-xl bg-surface-secondary animate-pulse" />
        </View>
      </Surface>
    );
  }

  const initials = deriveInitials(profile.display_name || 'U');
  const professionLabel =
    PROFESSION_OPTIONS.find((p) => p.value === profile.profession)?.label ?? profile.profession;

  return (
    <Surface className="p-4 rounded-3xl items-center mb-6">
      <View className="relative">
        <Avatar
          className="h-24 w-24 rounded-full border-4 border-accent/20 mb-3"
          alt={profile.display_name ?? 'User'}>
          {profile.avatar_url ? <Avatar.Image source={{ uri: profile.avatar_url }} /> : null}
          <Avatar.Fallback className="bg-accent/10">
            <Text className="text-accent font-black text-2xl">{initials}</Text>
          </Avatar.Fallback>
        </Avatar>
        <Pressable
          onPress={onEditPress}
          className="absolute bottom-3 right-0 bg-accent rounded-full p-2 border-2 border-surface shadow-md"
          accessibilityLabel="Modifier le profil">
          <Icon name="Pencil" size={14} className="text-white" />
        </Pressable>
      </View>

      <Text className="text-xl font-bold text-foreground">
        {profile.display_name ?? 'Utilisateur'}
      </Text>
      <Text className="text-sm text-muted mt-1">{professionLabel}</Text>
    </Surface>
  );
};
