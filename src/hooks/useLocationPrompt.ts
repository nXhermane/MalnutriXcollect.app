import { locationPrompt$ } from '@/store/ui/home.store';
import { user$, userProfile$ } from '@/store/user/user.store';
import { useObserve } from '@legendapp/state/react';

export function useLocationPrompt() {
  useObserve(() => {
    const isLoggedIn = user$.isLoggedIn.get();
    const profile = userProfile$.get();
    const alreadyShown = locationPrompt$.locationPromptShownThisSession.get();

    if (!isLoggedIn || !profile || alreadyShown) return;

    if (profile.department_id === null) {
      locationPrompt$.locationPromptShownThisSession.set(true);
      locationPrompt$.shouldShowLocationSheet.set(true);
    }
  });
}
