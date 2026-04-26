import { Patient, PatientStatus } from '@/schemas';
import { patients$ } from '@/store/patients/patients.store';
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

export const filteredPatients$ = observable<Patient[]>(() => {
  let list = Object.values(patients$.get());
  const q = home$.searchQuery.get();
  const f = home$.filters.get();

  if (q.trim()) {
    const lower = q.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(lower));
  }
  if (f.sex) {
    list = list.filter((p) => p.sex === f.sex);
  }
  if (f.status) {
    list = list.filter((p) => (p.status ?? PatientStatus.NEW) === f.status);
  }

  return f.sortBy === 'name'
    ? [...list].sort((a, b) => a.name.localeCompare(b.name))
    : [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
