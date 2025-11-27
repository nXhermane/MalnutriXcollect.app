import { Observable, observable } from '@legendapp/state';

export class CrossViewModel {
  public isLoading$: Observable<boolean> = observable(false);

  export() {
    // TODO: implement export logic
  }
  import(raw: string) {
    // TODO: implement import logic
  }
}
