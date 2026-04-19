import { Text } from 'react-native';

export function CopyrightNotice() {
  const year = new Date().getFullYear();
  return (
    <Text className="mt-8 text-center text-2xs font-light text-muted">
      {`© ${year} MalnutriX — Tous droits réservés`}
    </Text>
  );
}
