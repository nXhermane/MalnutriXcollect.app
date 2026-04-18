import { EnrichedMarkdownText, EnrichedMarkdownTextProps } from 'react-native-enriched-markdown';
import { useValue } from '@legendapp/state/react';
import { isDark$ } from '@/store/ui/theme.store';
import { darkStyle, lightStyle } from '@/config/theme/markdown';
import { openURL } from 'expo-linking';

export function MarkdownText({ markdown, ...props }: EnrichedMarkdownTextProps) {
  const isDark = useValue(isDark$);
  return (
    <EnrichedMarkdownText
      flavor="github"
      markdown={markdown}
      onLinkPress={({ url }) => openURL(url)}
      markdownStyle={isDark ? darkStyle : lightStyle}
      {...props}
    />
  );
}
