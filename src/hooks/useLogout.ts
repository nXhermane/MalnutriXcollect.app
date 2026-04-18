import { signOut } from '@/services/supabase/auth';
import { user$ } from '@/store/user/user.store';
import { useCallback, useState } from 'react';
import { useToast } from './useToast';

export interface UseLogoutReturn {
  isSheetOpen: boolean;
  openLogoutSheet: () => void;
  closeLogoutSheet: () => void;
  isLoggingOut: boolean;
  confirmLogout: () => Promise<void>;
}

export function useLogout(): UseLogoutReturn {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();

  const openLogoutSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeLogoutSheet = useCallback(() => setIsSheetOpen(false), []);

  const confirmLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.show('Error', 'Erreur de déconnexion', error);
        return;
      }
      // On réinitialise uniquement la session en mémoire.
      // Les données locales (patients, visites, mesures, settings) restent
      // sur l'appareil — l'app est offline-first, pas besoin de tout effacer.
      user$.set({ isLoggedIn: false, isLoading: false, user: null });
    } finally {
      setIsLoggingOut(false);
      setIsSheetOpen(false);
    }
  }, [toast]);

  return { isSheetOpen, openLogoutSheet, closeLogoutSheet, isLoggingOut, confirmLogout };
}
