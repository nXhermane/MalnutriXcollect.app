import { SearchBar } from '../custom';
import { VStack } from '../ui/vstack';
import { modeles$ } from '@/store';
import { useValue } from '@legendapp/state/react';

export function ControlPanel({ showSearchBar = false }: { showSearchBar?: boolean }) {
  const seachText = useValue(modeles$.search_text);

  if (!showSearchBar) return null;
  return (
    <VStack className="gap-3 border-b border-border bg-card py-4">
      <VStack className="px-4">
        <SearchBar
          fieldProps={{
            placeholder: 'Rechercher un patient...',
            onChangeText: (text: string) => modeles$.search_text.set(text),
            value: seachText,
          }}
        />
      </VStack>
      {/* <Checkbox value="" className="px-4">
        <CheckboxIndicator className="h-5 w-5">
          <CheckboxIcon className="" size="sm" as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>Non exportés</CheckboxLabel>
      </Checkbox> */}
    </VStack>
  );
}
