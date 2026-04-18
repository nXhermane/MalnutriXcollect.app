import { observable } from '@legendapp/state';

interface HomeState {
  showSearchBar: boolean;
  searchQuery: string;
  filters: {
    sex: 'M' | 'F' | '';
    sortBy: 'name' | 'recent';
  };
}

export const home$ = observable<HomeState>({
  showSearchBar: false,
  searchQuery: '',
  filters: {
    sex: '',
    sortBy: 'recent',
  },
});
