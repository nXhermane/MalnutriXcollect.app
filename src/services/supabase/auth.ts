import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Session, User } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase, SUPABASE_STORAGE_KEY } from './config';
import { supabaseStorage } from './storage';

const APP_NAME = 'collect' as const;

export interface AuthResult<T> {
  data: T | null;
  error: string | null;
}

function getDeviceInfo() {
  return {
    platform: Platform.OS,
    os_version: String(Platform.Version),
    app_version: Constants.expoConfig?.version ?? 'unknown',
    app_slug: Constants.expoConfig?.slug ?? 'malnutrix_collect',
    device_name: Constants.deviceName ?? 'unknown',
    is_device: Constants.isDevice,
  };
}

async function trackAppActivity(userId: string): Promise<void> {
  const now = new Date().toISOString();
  const deviceInfo = getDeviceInfo();

  await supabase
    .from('profiles')
    .update({ origin_app: APP_NAME })
    .eq('id', userId)
    .is('origin_app', null);

  const { data: existing } = await supabase
    .from('user_app_activity')
    .select('login_count')
    .eq('user_id', userId)
    .eq('app', APP_NAME)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('user_app_activity')
      .update({
        last_seen_at: now,
        login_count: existing.login_count + 1,
        device_info: deviceInfo,
      })
      .eq('user_id', userId)
      .eq('app', APP_NAME);
  } else {
    await supabase.from('user_app_activity').insert({
      user_id: userId,
      app: APP_NAME,
      first_seen_at: now,
      last_seen_at: now,
      login_count: 1,
      device_info: deviceInfo,
    });
  }
}

export async function signInWithGoogle(): Promise<AuthResult<{ user: User; session: Session }>> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    if (!idToken) return { data: null, error: 'No ID token found in Google Sign-In response' };

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) return { data: null, error: error.message };
    if (!data.user || !data.session) return { data: null, error: 'No user or session returned' };

    trackAppActivity(data.user.id).catch(console.warn);

    return { data: { user: data.user, session: data.session }, error: null };
  } catch (e) {
    console.error('signInWithGoogle ', e);
    if (e && typeof e === 'object' && 'code' in e) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED)
        return { data: null, error: 'Sign in cancelled' };
      if (e.code === statusCodes.IN_PROGRESS)
        return { data: null, error: 'Sign in already in progress' };
    }
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function signOut(): Promise<AuthResult<void>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { data: null, error: error.message };
    await GoogleSignin.signOut();
    supabaseStorage.clearStore();
    return { data: undefined, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function getSession(): Promise<AuthResult<Session | null>> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return { data: null, error: error.message };
    return { data: data.session, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function getCurrentUser(): Promise<AuthResult<User | null>> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return { data: null, error: null }; // no session = not an error
    return { data: data.user, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export function subscribeToAuthStateChanges(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export function getOfflineSession(): { user: User; session: Session } | null {
  try {
    const raw = supabaseStorage.getItem(SUPABASE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user && parsed?.access_token) {
      return { user: parsed.user, session: parsed as Session };
    }
    return null;
  } catch {
    return null;
  }
}
