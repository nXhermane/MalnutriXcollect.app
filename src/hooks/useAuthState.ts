import { getOfflineSession, subscribeToAuthStateChanges } from '@/services/supabase';
import { user$ } from '@/store/user/user.store';
import { useValue } from '@legendapp/state/react';
import { useEffect } from 'react';

export function useAuthState() {
  const isLoggedIn = useValue(() => user$.isLoggedIn.get());
  const isLoading = useValue(() => user$.isLoading.get());

  useEffect(() => {
    const cached = getOfflineSession();
    if (cached) {
      user$.set({
        isLoggedIn: true,
        isLoading: false,
        user: {
          id: cached.user.id,
          email: cached.user.email,
          phone: cached.user.phone,
        },
      });
    }

    const unsubscribe = subscribeToAuthStateChanges((session) => {
      if (session?.user) {
        user$.set({
          isLoggedIn: true,
          isLoading: false,
          user: {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
          },
        });
      } else {
        user$.set({ isLoggedIn: false, isLoading: false, user: null });
      }
    });

    return unsubscribe;
  }, []);

  return { isLoggedIn, isLoading };
}
