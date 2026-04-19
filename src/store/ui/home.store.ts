import { PatientStatus } from '@/schemas';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '../config';

interface HomeState {
  showSearchBar: boolean;
  searchQuery: string;
  filters: {
    sex: 'M' | 'F' | '';
    status: PatientStatus | '';
    sortBy: 'name' | 'recent';
  };
}

export const home$ = observable<HomeState>({
  showSearchBar: false,
  searchQuery: '',
  filters: {
    sex: '',
    status: '',
    sortBy: 'recent',
  },
});

export const locationPrompt$ = observable<{
  showLocationSheet: boolean;
  shouldShowLocationSheet: boolean;
  locationPromptShownThisSession: boolean;
}>(
  synced({
    persist: {
      plugin: ObservablePersistMMKV,
      name: 'locationPrompt',
    },
    initial: {
      showLocationSheet: false,
      shouldShowLocationSheet: false,
      locationPromptShownThisSession: false,
    },
  }),
);
